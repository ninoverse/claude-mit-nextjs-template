import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // agentcfg writes the agent rules, and only agentcfg. Without this,
    // `next dev` run by a coding agent adds Next.js's own block to AGENTS.md.
    agentRules: false,
};

export default nextConfig;
