import { generateShortCode } from '../../src/utils/shortcode';

test('generates codes of given length', () => {
  const code = generateShortCode(8);
  expect(code).toHaveLength(8);
});
