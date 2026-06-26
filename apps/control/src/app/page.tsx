import { HealthPanel } from './health-panel';

export default function HomePage() {
  return <main className="shell"><section className="panel"><p className="eyebrow">ADO Control Room</p><h1>System Health</h1><HealthPanel /></section></main>;
}
