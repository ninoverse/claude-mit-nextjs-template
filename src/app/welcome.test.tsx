import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Welcome } from './welcome';

test('renders its content inside hmi elements', async () => {
    const screen = await render(<Welcome />);

    await expect
        .element(
            screen.getByRole('heading', { name: 'claude-mit-nextjs-template' }),
        )
        .toBeVisible();
    await expect.element(screen.getByText('Next.js')).toBeVisible();
});

test('upgrades the hmi elements, with the properties the wrappers pass', async () => {
    const screen = await render(<Welcome />);

    const card = screen.container.querySelector('hmi-card');
    const badge = screen.container.querySelector('hmi-badge');
    expect(customElements.get('hmi-card')).toBeDefined();
    expect(card?.shadowRoot).not.toBeNull();
    expect(card).toHaveProperty('variant', 'accent');
    expect(badge).toHaveProperty('variant', 'primary');
});
