import { AppShell } from "@/components/shell/AppShell";

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
