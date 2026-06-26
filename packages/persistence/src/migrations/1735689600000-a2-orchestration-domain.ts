import type { MigrationInterface, QueryRunner } from 'typeorm';

export class A2OrchestrationDomainMigration implements MigrationInterface {
  name = 'A2OrchestrationDomainMigration1735689600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS core');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS projects');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS state');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS planning');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS components');

    await queryRunner.query(`
      CREATE TABLE core.actors (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        actor_type varchar NOT NULL CHECK (actor_type IN ('human', 'system', 'state_machine', 'policy_engine', 'evidence_gate', 'worker', 'codex', 'local_model', 'claude_import', 'github', 'unknown')),
        actor_key varchar NOT NULL,
        user_account_id uuid,
        display_name varchar NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        CONSTRAINT actors_human_user_account_check CHECK (
          (actor_type = 'human' AND user_account_id IS NOT NULL)
          OR (actor_type <> 'human' AND user_account_id IS NULL)
        ),
        CONSTRAINT actors_type_key_unique UNIQUE (actor_type, actor_key)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE core.spec_library_revisions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        revision_key varchar NOT NULL UNIQUE,
        repository_identity varchar NOT NULL,
        commit_sha char(40) NOT NULL CHECK (commit_sha ~ '^[0-9a-f]{40}$'),
        approved_ref varchar NOT NULL,
        manifest_sha256 char(64) NOT NULL UNIQUE CHECK (manifest_sha256 ~ '^[0-9a-f]{64}$'),
        manifest_artifact_id uuid,
        status varchar NOT NULL CHECK (status IN ('approved', 'deprecated', 'revoked')),
        approved_by_actor_id uuid NOT NULL REFERENCES core.actors(id),
        approved_at timestamptz NOT NULL,
        CONSTRAINT spec_library_revisions_repository_commit_unique UNIQUE (repository_identity, commit_sha)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE projects.projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        version integer NOT NULL DEFAULT 1 CHECK (version > 0),
        project_key varchar NOT NULL UNIQUE,
        name varchar NOT NULL,
        description text NOT NULL DEFAULT '',
        active_spec_library_revision_id uuid REFERENCES core.spec_library_revisions(id),
        active_constraint_profile_id uuid,
        timezone varchar NOT NULL DEFAULT 'UTC',
        is_archived boolean NOT NULL DEFAULT false
      )
    `);

    await queryRunner.query(`
      CREATE TABLE state.state_subjects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        subject_type varchar NOT NULL CHECK (subject_type IN ('roadmap', 'feature_unit', 'component_work', 'job', 'artifact', 'human_verification_item', 'agent_ingest_run', 'verification_run', 'review_group', 'command_run', 'agent_run')),
        subject_key varchar NOT NULL,
        project_id uuid NOT NULL REFERENCES projects.projects(id) ON DELETE RESTRICT,
        current_status varchar NOT NULL CHECK (length(current_status) > 0),
        previous_status varchar,
        is_terminal boolean NOT NULL DEFAULT false,
        status_updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT state_subjects_project_subject_unique UNIQUE (project_id, subject_type, subject_key)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE projects.repositories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        version integer NOT NULL DEFAULT 1 CHECK (version > 0),
        project_id uuid NOT NULL REFERENCES projects.projects(id) ON DELETE RESTRICT,
        repository_key varchar NOT NULL,
        remote_url_redacted varchar NOT NULL,
        visibility varchar NOT NULL CHECK (visibility = 'public'),
        default_branch varchar NOT NULL,
        integration_branch varchar NOT NULL CHECK (length(integration_branch) > 0 AND integration_branch <> 'main'),
        protected_branches jsonb NOT NULL DEFAULT '["main"]'::jsonb,
        is_active boolean NOT NULL DEFAULT true,
        CONSTRAINT repositories_project_key_unique UNIQUE (project_id, repository_key)
      )
    `);
    await queryRunner.query('CREATE UNIQUE INDEX repositories_one_active_per_project_idx ON projects.repositories(project_id) WHERE is_active');

    await queryRunner.query(`
      CREATE TABLE projects.components (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        version integer NOT NULL DEFAULT 1 CHECK (version > 0),
        project_id uuid NOT NULL REFERENCES projects.projects(id) ON DELETE RESTRICT,
        component_key varchar NOT NULL,
        component_type varchar NOT NULL,
        display_name varchar NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        is_required_for_feature_default boolean NOT NULL DEFAULT true,
        CONSTRAINT components_project_key_unique UNIQUE (project_id, component_key)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE projects.component_repositories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        component_id uuid NOT NULL REFERENCES projects.components(id) ON DELETE RESTRICT,
        repository_id uuid NOT NULL REFERENCES projects.repositories(id) ON DELETE RESTRICT,
        relative_root varchar NOT NULL CHECK (relative_root = '.' OR (relative_root !~ '^/' AND relative_root !~ '\\.\\.')),
        is_primary boolean NOT NULL DEFAULT false,
        CONSTRAINT component_repositories_mapping_unique UNIQUE (component_id, repository_id, relative_root)
      )
    `);
    await queryRunner.query('CREATE UNIQUE INDEX component_repositories_one_primary_idx ON projects.component_repositories(component_id) WHERE is_primary');

    await queryRunner.query(`
      CREATE TABLE projects.project_constraint_profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        project_id uuid NOT NULL REFERENCES projects.projects(id) ON DELETE RESTRICT,
        profile_version varchar NOT NULL,
        status varchar NOT NULL CHECK (status IN ('draft', 'ready_for_human_review', 'approved', 'active', 'superseded', 'archived', 'rejected')),
        source_artifact_id uuid UNIQUE,
        content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
        identity_json jsonb NOT NULL,
        components_json jsonb NOT NULL,
        design_json jsonb NOT NULL,
        architecture_json jsonb NOT NULL,
        verification_json jsonb NOT NULL,
        forbidden_behavior_json jsonb NOT NULL DEFAULT '[]'::jsonb,
        open_questions_json jsonb NOT NULL DEFAULT '[]'::jsonb,
        approved_by_decision_id uuid,
        activated_at timestamptz,
        supersedes_id uuid REFERENCES projects.project_constraint_profiles(id),
        CONSTRAINT project_constraint_profiles_project_version_unique UNIQUE (project_id, profile_version)
      )
    `);
    await queryRunner.query('CREATE UNIQUE INDEX project_constraint_profiles_one_active_idx ON projects.project_constraint_profiles(project_id) WHERE status = \'active\'');
    await queryRunner.query('ALTER TABLE projects.projects ADD CONSTRAINT projects_active_constraint_profile_fk FOREIGN KEY (active_constraint_profile_id) REFERENCES projects.project_constraint_profiles(id)');

    await queryRunner.query(`
      CREATE TABLE planning.roadmaps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        project_id uuid NOT NULL REFERENCES projects.projects(id) ON DELETE RESTRICT,
        roadmap_key varchar NOT NULL,
        title varchar NOT NULL,
        summary text NOT NULL DEFAULT '',
        status_subject_id uuid NOT NULL UNIQUE REFERENCES state.state_subjects(id) ON DELETE RESTRICT,
        source_version varchar NOT NULL,
        approved_at timestamptz,
        CONSTRAINT roadmaps_project_key_unique UNIQUE (project_id, roadmap_key)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE planning.roadmap_sources (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        roadmap_id uuid NOT NULL REFERENCES planning.roadmaps(id) ON DELETE RESTRICT,
        artifact_id uuid NOT NULL,
        source_kind varchar NOT NULL,
        source_version varchar NOT NULL,
        imported_by_actor_id uuid REFERENCES core.actors(id),
        is_current boolean NOT NULL DEFAULT true,
        content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$')
      )
    `);
    await queryRunner.query('CREATE UNIQUE INDEX roadmap_sources_one_current_idx ON planning.roadmap_sources(roadmap_id) WHERE is_current');

    await queryRunner.query(`
      CREATE TABLE planning.feature_units (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        roadmap_id uuid NOT NULL REFERENCES planning.roadmaps(id) ON DELETE RESTRICT,
        feature_unit_key varchar NOT NULL,
        title varchar NOT NULL,
        intent text NOT NULL DEFAULT '',
        risk_level varchar NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
        status_subject_id uuid NOT NULL UNIQUE REFERENCES state.state_subjects(id) ON DELETE RESTRICT,
        constraint_profile_id uuid NOT NULL REFERENCES projects.project_constraint_profiles(id) ON DELETE RESTRICT,
        sequence_number integer NOT NULL CHECK (sequence_number > 0),
        CONSTRAINT feature_units_roadmap_key_unique UNIQUE (roadmap_id, feature_unit_key),
        CONSTRAINT feature_units_roadmap_sequence_unique UNIQUE (roadmap_id, sequence_number)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE planning.feature_unit_relations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        from_feature_unit_id uuid NOT NULL REFERENCES planning.feature_units(id) ON DELETE RESTRICT,
        to_feature_unit_id uuid NOT NULL REFERENCES planning.feature_units(id) ON DELETE RESTRICT,
        relation_type varchar NOT NULL CHECK (relation_type IN ('depends_on', 'blocks', 'relates_to')),
        is_blocking boolean NOT NULL DEFAULT true,
        waived_by_decision_id uuid,
        reason text NOT NULL DEFAULT '',
        CONSTRAINT feature_unit_relations_unique UNIQUE (from_feature_unit_id, to_feature_unit_id, relation_type),
        CONSTRAINT feature_unit_relations_no_self CHECK (from_feature_unit_id <> to_feature_unit_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE components.component_works (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        created_by_actor_id uuid REFERENCES core.actors(id),
        feature_unit_id uuid NOT NULL REFERENCES planning.feature_units(id) ON DELETE RESTRICT,
        component_id uuid NOT NULL REFERENCES projects.components(id) ON DELETE RESTRICT,
        repository_id uuid NOT NULL REFERENCES projects.repositories(id) ON DELETE RESTRICT,
        component_work_key varchar NOT NULL,
        execution_scope varchar NOT NULL CHECK (execution_scope IN ('single', 'coordinated')),
        title varchar NOT NULL,
        intent text NOT NULL DEFAULT '',
        risk_level varchar NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
        status_subject_id uuid NOT NULL UNIQUE REFERENCES state.state_subjects(id) ON DELETE RESTRICT,
        constraint_profile_id uuid NOT NULL REFERENCES projects.project_constraint_profiles(id) ON DELETE RESTRICT,
        verification_profile_id uuid,
        base_branch varchar NOT NULL CHECK (base_branch <> 'main'),
        head_branch varchar NOT NULL CHECK (head_branch LIKE 'ado/%'),
        allowed_paths_version varchar NOT NULL,
        is_required boolean NOT NULL DEFAULT true,
        sequence_number integer NOT NULL CHECK (sequence_number > 0),
        CONSTRAINT component_works_feature_key_unique UNIQUE (feature_unit_id, component_work_key)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE components.component_work_scopes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        component_work_id uuid NOT NULL REFERENCES components.component_works(id) ON DELETE RESTRICT,
        component_id uuid NOT NULL REFERENCES projects.components(id) ON DELETE RESTRICT,
        repository_id uuid NOT NULL REFERENCES projects.repositories(id) ON DELETE RESTRICT,
        relative_root varchar NOT NULL CHECK (relative_root = '.' OR (relative_root !~ '^/' AND relative_root !~ '\\.\\.')),
        scope_role varchar NOT NULL CHECK (scope_role IN ('primary', 'contributing', 'shared_contract')),
        is_required boolean NOT NULL DEFAULT true,
        source_mapping_id uuid REFERENCES projects.component_repositories(id),
        CONSTRAINT component_work_scopes_component_unique UNIQUE (component_work_id, component_id),
        CONSTRAINT component_work_scopes_root_unique UNIQUE (component_work_id, relative_root)
      )
    `);
    await queryRunner.query('CREATE UNIQUE INDEX component_work_scopes_one_primary_idx ON components.component_work_scopes(component_work_id) WHERE scope_role = \'primary\'');

    await queryRunner.query(`
      CREATE TABLE components.allowed_path_rules (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        component_work_id uuid NOT NULL REFERENCES components.component_works(id) ON DELETE RESTRICT,
        path_pattern varchar NOT NULL CHECK (path_pattern <> '' AND path_pattern !~ '^/'),
        access_mode varchar NOT NULL CHECK (access_mode IN ('read', 'write')),
        is_required boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL CHECK (sort_order > 0),
        created_from_artifact_id uuid,
        CONSTRAINT allowed_path_rules_unique UNIQUE (component_work_id, path_pattern, access_mode)
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS components.allowed_path_rules');
    await queryRunner.query('DROP INDEX IF EXISTS components.component_work_scopes_one_primary_idx');
    await queryRunner.query('DROP TABLE IF EXISTS components.component_work_scopes');
    await queryRunner.query('DROP TABLE IF EXISTS components.component_works');
    await queryRunner.query('DROP TABLE IF EXISTS planning.feature_unit_relations');
    await queryRunner.query('DROP TABLE IF EXISTS planning.feature_units');
    await queryRunner.query('DROP INDEX IF EXISTS planning.roadmap_sources_one_current_idx');
    await queryRunner.query('DROP TABLE IF EXISTS planning.roadmap_sources');
    await queryRunner.query('DROP TABLE IF EXISTS planning.roadmaps');
    await queryRunner.query('ALTER TABLE projects.projects DROP CONSTRAINT IF EXISTS projects_active_constraint_profile_fk');
    await queryRunner.query('DROP INDEX IF EXISTS projects.project_constraint_profiles_one_active_idx');
    await queryRunner.query('DROP TABLE IF EXISTS projects.project_constraint_profiles');
    await queryRunner.query('DROP INDEX IF EXISTS projects.component_repositories_one_primary_idx');
    await queryRunner.query('DROP TABLE IF EXISTS projects.component_repositories');
    await queryRunner.query('DROP TABLE IF EXISTS projects.components');
    await queryRunner.query('DROP INDEX IF EXISTS projects.repositories_one_active_per_project_idx');
    await queryRunner.query('DROP TABLE IF EXISTS projects.repositories');
    await queryRunner.query('DROP TABLE IF EXISTS state.state_subjects');
    await queryRunner.query('DROP TABLE IF EXISTS projects.projects');
    await queryRunner.query('DROP TABLE IF EXISTS core.spec_library_revisions');
    await queryRunner.query('DROP TABLE IF EXISTS core.actors');
    await queryRunner.query('DROP SCHEMA IF EXISTS components');
    await queryRunner.query('DROP SCHEMA IF EXISTS planning');
    await queryRunner.query('DROP SCHEMA IF EXISTS state');
    await queryRunner.query('DROP SCHEMA IF EXISTS projects');
    await queryRunner.query('DROP SCHEMA IF EXISTS core');
  }
}
