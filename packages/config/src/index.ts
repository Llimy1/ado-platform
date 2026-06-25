import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

function loadNearestDotenv(startDirectory = process.cwd()): void {
  let directory = startDirectory;
  while (true) {
    const candidate = join(directory, '.env');
    if (existsSync(candidate)) {
      loadDotenv({ path: candidate });
      return;
    }
    const parent = dirname(directory);
    if (parent === directory) return;
    directory = parent;
  }
}

loadNearestDotenv();

const environmentSchema = z.object({
  ADO_DATABASE_URL: z.string().url(),
  ADO_API_PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  ADO_CONTROL_ORIGIN: z.string().url().default('http://localhost:3000'),
  ADO_API_ENV: z.enum(['development', 'test', 'production']).default('development')
});
export type AdoEnvironment = z.infer<typeof environmentSchema>;
export function loadEnvironment(source: NodeJS.ProcessEnv = process.env): AdoEnvironment { return environmentSchema.parse(source); }
