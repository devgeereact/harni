import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allowScoreStorage, deleteBest, readBest, writeBest } from '../../src/game/storage.ts';

test('score storage requires opt-in and withdrawal stops access', () => {
  let reads = 0;
  let writes = 0;
  const values = new Map<string, string>([['harni.pier-run.best', '42']]);
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: {
    getItem: (key: string) => { reads++; return values.get(key) ?? null; },
    setItem: (key: string, value: string) => { writes++; values.set(key, value); },
    removeItem: (key: string) => values.delete(key),
  } } });
  allowScoreStorage(false);
  assert.equal(readBest(), 0);
  assert.equal(writeBest(10), false);
  assert.equal(reads + writes, 0);
  allowScoreStorage(true);
  assert.equal(readBest(), 42);
  assert.equal(writeBest(55.6), true);
  assert.equal(readBest(), 56);
  allowScoreStorage(false);
  assert.equal(deleteBest(), true);
  assert.equal(values.size, 0);
  assert.equal(readBest(), 0);
});

test('blocked browser storage never breaks gameplay', () => {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    get localStorage() { throw new Error('Storage blocked'); },
  } });
  allowScoreStorage(true);
  assert.equal(readBest(), 0);
  assert.equal(writeBest(10), false);
  assert.equal(deleteBest(), false);
  allowScoreStorage(false);
});
