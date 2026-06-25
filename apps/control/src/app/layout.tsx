import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'ADO Control Room', description: 'Agent Development Orchestrator control plane' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
