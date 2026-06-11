import manifest from '../manifest.json';
import packageJson from '../package.json';
import { describe, expect, it } from 'vitest';

describe('minimal extension manifest', () => {
  it('only exposes the full-year calendar new tab surface', () => {
    expect(manifest.chrome_url_overrides).toEqual({ newtab: 'newtab.html' });
    expect('permissions' in manifest).toBe(false);
    expect('host_permissions' in manifest).toBe(false);
    expect('background' in manifest).toBe(false);
    expect('options_ui' in manifest).toBe(false);
  });

  it('keeps store-facing manifest metadata release ready', () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.default_locale).toBe('en');
    expect(manifest.name).toBe('__MSG_appName__');
    expect(manifest.description).toBe('__MSG_appDescription__');
    expect(manifest.version).toBe(packageJson.version);
    expect(manifest.incognito).toBe('not_allowed');
    expect(manifest.icons).toEqual({
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    });
  });

  it('uses a restrictive MV3 CSP without remote or unsafe code allowances', () => {
    const csp = manifest.content_security_policy.extension_pages;

    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("font-src 'self'");
    expect(csp).not.toMatch(/https?:/);
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain('wasm-unsafe-eval');
  });
});
