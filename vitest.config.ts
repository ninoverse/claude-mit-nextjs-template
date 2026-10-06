import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Tests run in Chromium through Playwright, where hmi's custom elements upgrade
// and render their shadow DOM as they do for a visitor.
export default defineConfig({
    test: {
        include: ['**/*.test.{ts,tsx}'],
        exclude: ['node_modules/**', '.next/**'],
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            screenshotFailures: false,
        },
    },
});
