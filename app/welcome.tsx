'use client';

import { Badge } from '@ninoverse/hmi-components/react/badge';
import { Card } from '@ninoverse/hmi-components/react/card';

/**
 * The starting page's content. hmi's elements are custom elements, so they
 * render in the browser: this is a client component, and the server sends
 * their tags and children for the client to upgrade.
 */
export function Welcome() {
    return (
        <Card variant="accent">
            <h1>claude-mit-nextjs-template</h1>
            <p>
                Edit <code>app/page.tsx</code> to start.
            </p>
            <Badge variant="primary">Next.js</Badge>
        </Card>
    );
}
