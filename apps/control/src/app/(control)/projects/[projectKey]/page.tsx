import { ProjectOverviewRoute } from "@/features/project-overview/project-overview-route";
import { getProjectOverview } from "@/lib/data";

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectKey: string }>;
}) {
  const { projectKey } = await params;
  const overview = getProjectOverview(projectKey);

  return (
    <ProjectOverviewRoute
      projectKey={projectKey}
      initialOverview={overview}
      initialStatus={overview ? 200 : 404}
    />
  );
}
