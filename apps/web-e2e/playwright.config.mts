import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4890';

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm nx run worker:serve',
    url: baseURL,
    reuseExistingServer: true,
    cwd: workspaceRoot,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: 'admin.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    // Last: it publishes a post, and the blog specs expect the e2e blog to be empty.
    {
      name: 'admin',
      testMatch: 'admin.spec.ts',
      dependencies: ['chromium'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
