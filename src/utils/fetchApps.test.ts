import { describe, it, expect } from 'vitest';
import { getApps } from './fetchApps';

describe('fetchApps utility', () => {
  it('loads apps list from content directory', () => {
    const apps = getApps();
    expect(apps.length).toBeGreaterThan(0);
    expect(apps[0]).toHaveProperty('title');
    expect(apps[0]).toHaveProperty('description');
  });
});
