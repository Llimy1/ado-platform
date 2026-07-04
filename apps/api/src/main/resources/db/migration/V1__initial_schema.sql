create table ado_schema_marker (
    id bigint generated always as identity primary key,
    marker_key varchar(100) not null unique,
    created_at timestamptz not null default now()
);