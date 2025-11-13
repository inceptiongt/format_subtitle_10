import { expect, test } from '@rstest/core';
import { squared } from '../src/index';

test('squared', () => {
  expect(squared(2)).toBe(4);
  expect(squared(12)).toBe(144);
  expect({a: 2065}).toMatchSnapshot({
    a: expect.toBeWithin(2000, 3000),
  })
});

