create table ado_roadmap (
    id uuid primary key,
    project_id uuid not null,
    roadmap_key varchar(80) not null,
    title varchar(200) not null,
    description varchar(1000),
    status varchar(30) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_ado_roadmap_project
        foreign key (project_id)
        references ado_project (id)
);

create index idx_ado_roadmap_project_id
    on ado_roadmap (project_id);

create unique index uq_ado_roadmap_project_key
    on ado_roadmap (project_id, roadmap_key);
