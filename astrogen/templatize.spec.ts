import { escapeBackticks } from './templatize';

describe('templatize', () => {

  it('escaped backtick', () => {
    expect(`\``).toBe('`')
  })

  it('should escape backticks', () => {
    expect(escapeBackticks('')).toBe('');
    expect(escapeBackticks('`a`')).toBe('\\`a\\`');
    expect(escapeBackticks('q=`a${x}b`;')).toBe('q=\\`a\\${x}b\\`;');
    // escaped backticks: improve when needed
    // expect(escapeBackticks('`\\``')).toBe('\\`\\`');
  });
});
