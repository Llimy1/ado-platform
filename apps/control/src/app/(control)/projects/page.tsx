import { ProjectListRoute } from "@/features/projects/project-list-route";
import { queryProjects, validateProjectListQuery } from "@/lib/data";

function toSearchParams(sp: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else {
      params.append(key, value);
    }
  }
  return params;
}

/**
 * P-01.8: page.tsx obtains the initial no-store snapshot. In this prototype
 * there is no generated OpenAPI client or network hop; the mock read model
 * is queried in-process, matching the same validated query contract the
 * client-side fetches on /api/mock/projects use.
 */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const result = validateProjectListQuery(toSearchParams(resolved));

  if ("error" in result) {
    return <ProjectListRoute initialResponse={null} initialErrorRequestId={result.error.code} />;
  }

  const initialResponse = queryProjects(result.query);
  return <ProjectListRoute initialResponse={initialResponse} />;
}
