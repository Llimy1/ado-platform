import type { ComponentType, SVGProps } from "react";
import { IconArchive, IconFolder, IconInbox, IconSiren } from "@/components/icons";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  implemented: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Mirrors the Information Architecture table in
 * ADO/CONTROL_ROOM_API_UI_SPEC.md §3. Icons give the collapsed
 * 768-1023px icon rail a visual identity (labels are hidden at that width).
 * Artifact detail has no list route of its own (P-10.1 only defines the
 * nested detail route, reached from evidence links elsewhere), so
 * "Artifacts & Settings" routes to /settings, the closest thing to a
 * landing/inspection surface.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: "projects", label: "Projects", href: "/projects", implemented: true, icon: IconFolder },
  { key: "ado-projects", label: "ADO Projects (API)", href: "/ado-projects", implemented: true, icon: IconFolder },
  { key: "inbox", label: "Human Decision Inbox", href: "/decisions", implemented: true, icon: IconInbox },
  { key: "incidents", label: "Incidents", href: "/incidents", implemented: true, icon: IconSiren },
  { key: "artifacts", label: "Artifacts & Settings", href: "/settings", implemented: true, icon: IconArchive },
];
