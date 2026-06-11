import { describe, expect, it } from 'vitest';
import manifestText from '../manifest.json?raw';
import appText from '../src/components/App.tsx?raw';
import settingsFormText from '../src/components/settings/SettingsForm.tsx?raw';
import storeText from '../src/state/store.ts?raw';
import bootstrapText from '../src/theme/bootstrap.ts?raw';
import inlineText from '../src/theme/inline.ts?raw';
import publicBootstrapText from '../public/theme-bootstrap.js?raw';

describe('privacy guards', () => {
  it('keeps runtime source free of network APIs and remote asset references', () => {
    const combined = [
      manifestText,
      publicBootstrapText,
      appText,
      settingsFormText,
      storeText,
      bootstrapText,
      inlineText,
    ].join('\n');

    expect(combined).not.toMatch(/\bfetch\s*\(/);
    expect(combined).not.toMatch(/\bXMLHttpRequest\b/);
    expect(combined).not.toMatch(/\bsendBeacon\s*\(/);
    expect(combined).not.toMatch(/https?:\/\//);
  });

  it('theme bootstrap reads the consolidated local settings key only', () => {
    expect(publicBootstrapText).toContain('fyi:calendar-settings');
    expect(inlineText).toContain('fyi:calendar-settings');
    expect(publicBootstrapText).not.toContain('fyi:theme-pref');
    expect(publicBootstrapText).not.toContain('fyi:theme-cache');
    expect(inlineText).not.toContain('fyi:theme-pref');
    expect(inlineText).not.toContain('fyi:theme-cache');
  });
});
