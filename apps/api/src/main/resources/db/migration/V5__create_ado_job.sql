create table ado_artifact (
    id uuid primary key,
    project_id uuid not null,
    artifact_key varchar(120) not null,
    artifact_type varchar(60) not null,
    status varchar(30) not null,
    classification varchar(30) not null,
    content_sha256 varchar(64),
    byte_size bigint not null default 0,
    storage_uri varchar(500),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_artifact_project
        foreign key (project_id)
        references ado_project (id),
    constraint uq_ado_artifact_project_key
        unique (project_id, artifact_key),
    constraint chk_ado_artifact_byte_size_non_negative
        check (byte_size >= 0)
);

create index idx_ado_artifact_project_id
    on ado_artifact (project_id);

create index idx_ado_artifact_content_sha256
    on ado_artifact (content_sha256);

create table ado_context_packet (
    id uuid primary key,
    artifact_id uuid not null,
    target_type varchar(60) not null,
    target_ref varchar(200) not null,
    packet_role varchar(60) not null,
    context_hash varchar(64) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_context_packet_artifact
        foreign key (artifact_id)
        references ado_artifact (id),
    constraint uq_ado_context_packet_artifact
        unique (artifact_id)
);

create index idx_ado_context_packet_target
    on ado_context_packet (target_type, target_ref);

create table ado_job (
    id uuid primary key,
    project_id uuid not null,
    context_packet_id uuid,
    job_key varchar(120) not null,
    idempotency_key varchar(160) not null,
    job_type varchar(60) not null,
    target_type varchar(60) not null,
    target_ref varchar(200) not null,
    title varchar(200) not null,
    description varchar(1000),
    priority integer not null default 100,
    scheduled_at timestamptz not null default now(),
    status varchar(30) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_job_project
        foreign key (project_id)
        references ado_project (id),
    constraint fk_ado_job_context_packet
        foreign key (context_packet_id)
        references ado_context_packet (id),
    constraint uq_ado_job_project_job_key
        unique (project_id, job_key),
    constraint uq_ado_job_project_idempotency_key
        unique (project_id, idempotency_key),
    constraint chk_ado_job_priority_non_negative
        check (priority >= 0)
);

create index idx_ado_job_project_id
    on ado_job (project_id);

create index idx_ado_job_status_schedule
    on ado_job (status, scheduled_at, priority, created_at, id);

create table ado_worker_registration (
    id uuid primary key,
    worker_key varchar(120) not null,
    display_name varchar(200),
    status varchar(30) not null,
    capabilities_json text not null,
    version varchar(80) not null,
    max_concurrent_jobs integer not null default 1,
    started_at timestamptz not null,
    last_heartbeat_at timestamptz not null,
    offline_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_ado_worker_registration_worker_key
        unique (worker_key),
    constraint chk_ado_worker_max_concurrent_jobs_positive
        check (max_concurrent_jobs > 0)
);

create index idx_ado_worker_registration_status
    on ado_worker_registration (status, last_heartbeat_at);

create table ado_job_attempt (
    id uuid primary key,
    job_id uuid not null,
    attempt_number integer not null,
    status varchar(30) not null,
    worker_key varchar(120),
    lease_expires_at timestamptz,
    last_heartbeat_at timestamptz,
    started_at timestamptz,
    finished_at timestamptz,
    timeout_at timestamptz,
    exit_code integer,
    signal varchar(80),
    failure_code varchar(120),
    redacted_summary varchar(1000),
    result_artifact_id uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_job_attempt_job
        foreign key (job_id)
        references ado_job (id),
    constraint fk_ado_job_attempt_result_artifact
        foreign key (result_artifact_id)
        references ado_artifact (id),
    constraint uq_ado_job_attempt_number
        unique (job_id, attempt_number),
    constraint chk_ado_job_attempt_number_positive
        check (attempt_number > 0)
);

create unique index uq_ado_job_attempt_active
    on ado_job_attempt (job_id)
    where status in ('leased', 'running');

create index idx_ado_job_attempt_status_lease
    on ado_job_attempt (status, lease_expires_at);

create table ado_job_event (
    id uuid primary key,
    job_id uuid not null,
    job_attempt_id uuid,
    artifact_id uuid,
    sequence bigint not null,
    event_type varchar(80) not null,
    level varchar(20) not null,
    message varchar(1000) not null,
    occurred_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_job_event_job
        foreign key (job_id)
        references ado_job (id),
    constraint fk_ado_job_event_attempt
        foreign key (job_attempt_id)
        references ado_job_attempt (id),
    constraint fk_ado_job_event_artifact
        foreign key (artifact_id)
        references ado_artifact (id),
    constraint uq_ado_job_event_sequence
        unique (job_id, sequence)
);

create index idx_ado_job_event_attempt_sequence
    on ado_job_event (job_attempt_id, sequence);

create table ado_agent_run (
    id uuid primary key,
    job_attempt_id uuid not null,
    role varchar(80) not null,
    provider varchar(80) not null,
    model_identifier varchar(160) not null,
    status varchar(30) not null,
    input_artifact_id uuid,
    output_artifact_id uuid,
    started_at timestamptz not null,
    finished_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_agent_run_attempt
        foreign key (job_attempt_id)
        references ado_job_attempt (id),
    constraint fk_ado_agent_run_input_artifact
        foreign key (input_artifact_id)
        references ado_artifact (id),
    constraint fk_ado_agent_run_output_artifact
        foreign key (output_artifact_id)
        references ado_artifact (id)
);

create index idx_ado_agent_run_attempt_started
    on ado_agent_run (job_attempt_id, started_at);

create table ado_command_run (
    id uuid primary key,
    job_attempt_id uuid not null,
    command_key varchar(120) not null,
    status varchar(30) not null,
    exit_code integer,
    timed_out boolean not null default false,
    stdout_artifact_id uuid,
    stderr_artifact_id uuid,
    started_at timestamptz not null,
    finished_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_command_run_attempt
        foreign key (job_attempt_id)
        references ado_job_attempt (id),
    constraint fk_ado_command_run_stdout_artifact
        foreign key (stdout_artifact_id)
        references ado_artifact (id),
    constraint fk_ado_command_run_stderr_artifact
        foreign key (stderr_artifact_id)
        references ado_artifact (id)
);

create index idx_ado_command_run_attempt_started
    on ado_command_run (job_attempt_id, started_at);
