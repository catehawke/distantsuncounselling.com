/**
 * Provides Nunjucks shortcode to obfuscate emails etc.
 * @param {String} text the text to obfuscate
 * @param {String} scheme  if provided the text will be wrapped in an <a/> tag
 * @param {String} className <a/> className if scheme provided
 * @returns {String}
 */
module.exports = function obfuscate(text, scheme, className) {
  if (!scheme) return toEntities(text);
  const classAttr = className ? `class="${className}" ` : '';
  const href = `${scheme}:${text}`;
  return `<a ${classAttr}href="${toEntities(href)}">${toEntities(text)}</a>`;
};

function toEntities(str) {
  return Array.from(str)
    .map((char) => `&#${char.charCodeAt(0)};`)
    .join('');
}
