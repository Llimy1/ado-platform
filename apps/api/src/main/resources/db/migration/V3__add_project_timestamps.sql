alter table ado_project
add column updated_at timestamptz not null default now();