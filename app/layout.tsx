import type { Metadata } from 'next';
import type { ReactNode } from 'react';
// hmi-components' theme: the constant tokens, one color theme and one
// structure theme, then the base stylesheet its elements expect.
import '@ninoverse/hmi-components/themes/constants.css';
import '@ninoverse/hmi-components/themes/color/default.css';
import '@ninoverse/hmi-components/themes/structure/default.css';
import '@ninoverse/hmi-components/base.css';

export const metadata: Metadata = {
    title: 'claude-mit-nextjs-template',
    description: 'A Next.js app started from the ninoverse template.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
