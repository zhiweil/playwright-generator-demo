import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
config();

export default defineConfig({
  testDir: './generated',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: (process.env.VIDEO || 'retain-on-failure') as 'off' | 'on' | 'retain-on-failure' | 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ].filter(p => !process.env.BROWSER || p.name === (process.env.BROWSER || 'chromium')),
});
