/**
 * Escape RegExp special characters
 *
 * Inlined from escape-string-regexp@5.0.0 as we don't use ESM here.
 *
 * @see https://github.com/sindresorhus/escape-string-regexp
 *
 * @param {string} string
 * @returns {RegEx}
 */
const escapeStringRegexp = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
};

/**
 * Default obsfuscator function transforms to html entities
 *
 * @param {string} str
 * @returns {string}
 */
const toEntities = (str) =>
  Array.from(str)
    .map((char) => `&#${char.charCodeAt(0)};`)
    .join('');

/**
 * Eleventy-loader plugin to obsfuscate given values in html output.
 *
 * This plugin rule should follow the eleventy-load-html loader to avoid entities being unescaped.
 *
 * @param {string} content
 * @param {{ enabled?: boolean, values?:string[], obsfuscator?: (s:string) => string }} options
 * @returns {string}
 */
module.exports = function (content, options = {}) {
  const { enabled, values = [], obsfuscator = toEntities } = options;

  if (!enabled) {
    return content;
  }

  return values.reduce((acc, value) => {
    const re = new RegExp(escapeStringRegexp(value), 'g');
    acc = acc.replace(re, (match) => obsfuscator(match));
    return acc;
  }, content);
};
