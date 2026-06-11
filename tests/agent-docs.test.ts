import { describe, expect, it } from 'vitest';
import agentsText from '../AGENTS.md?raw';
import claudeText from '../CLAUDE.md?raw';
import geminiText from '../GEMINI.md?raw';
import copilotText from '../.github/copilot-instructions.md?raw';
import setupText from '../docs/agents/CHROME-AI-AGENT-SETUP.md?raw';
import privacyText from '../docs/PRIVACY.md?raw';
import storeText from '../CHROMEWEBSTORE.md?raw';

describe('agent Chrome extension guidance', () => {
  it('tells all supported agents to use Chrome extension skills', () => {
    for (const text of [agentsText, claudeText, geminiText, copilotText]) {
      expect(text).toContain('Modern Web Guidance');
      expect(text).toContain('chrome-extensions');
      expect(text).toContain('CHROMEWEBSTORE.md');
    }
  });

  it('documents Chrome-recommended agent setup commands', () => {
    expect(setupText).toContain('npx modern-web-guidance@latest install --choose');
    expect(setupText).toContain('chrome-extensions');
    expect(setupText).toContain('modern-web-guidance');
    expect(setupText).toContain('chrome-devtools-mcp');
    expect(setupText).toContain('--category-extensions');
    expect(setupText).toContain('--categoryExtensions');
  });

  it('tracks Chrome Web Store handoff fields', () => {
    expect(storeText).toContain('Single Purpose');
    expect(storeText).toContain('Permissions');
    expect(storeText).toContain('Host Permissions');
    expect(storeText).toContain('Privacy');
    expect(storeText).toContain('No user data is collected');
    expect(storeText).toContain('docs/PRIVACY.md');
  });

  it('keeps the privacy handoff aligned with local-only behavior', () => {
    expect(privacyText).toContain('fyi:calendar-settings');
    expect(privacyText).toContain('does not collect, transmit, sell, or share personal data');
    expect(privacyText).toContain('no permissions');
    expect(privacyText).toContain('no host permissions');
    expect(privacyText).toContain('no background worker');
    expect(privacyText).toContain('no analytics');
    expect(privacyText).toContain('no network requests');
  });
});
