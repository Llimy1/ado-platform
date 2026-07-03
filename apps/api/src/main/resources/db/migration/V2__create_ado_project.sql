create table ado_project (
    id bigint generated always as identity primary key,
    project_key varchar(80) not null unique,
    name varchar(200) not null,
    created_at timestamptz not null default now()
);
