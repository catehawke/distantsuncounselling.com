const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { dir } = require(path.resolve('.eleventy.js'));

if (!dir?.output) {
  throw new Error(
    'Cannot get `dir.output` from `.eleventy.js`, did you export it?'
  );
}

const getPageHtml = (filePath) => {
  try {
    const html = fs.readFileSync(path.resolve(dir?.output, filePath), 'utf8');
    return html.toString();
  } catch (err) {
    throw new Error(`Cannot find page '${filePath}'. Have you built the site?`);
  }
};

const createDomfromHtml = (html, options) =>
  new JSDOM(html, options).window.document;

/**
 * Loads a given html file and creates a Document instance, returning access methods.
 *
 * Note: <script> tags are not evaluated
 *
 * @param {string} filePath path to the file under test
 * @returns {{
 *  document: HTMLDocument,
 *  query: Function,
 *  queryAll: Function,
 *  getAttrs: Function,
 *  getRootAttrs: Function,
 *  getTitle: Function,
 *  getMeta: Function,
 *  getLinkHrefs: Function,
 *  getText: Function,
 *  containsText: Function,
 * }}
 */
const loadPage = (filePath) => {
  const document = createDomfromHtml(getPageHtml(filePath));

  const query = (sel) => document.querySelector(sel);
  const queryAll = (sel) => Array.from(document.querySelectorAll(sel));
  const getAttrs = (el) => {
    if (!el.hasAttributes()) {
      return {};
    }

    return Array.from(el.attributes).reduce((acc, attr) => {
      if (attr.name) {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});
  };

  const getText = (el) => String(el.textContent);
  const containsText = (el, text) => getText(el).includes(text);

  return {
    document,
    query,
    queryAll,
    getAttrs,
    getText,
    containsText,
    getRootAttrs: () => getAttrs(document.documentElement),
    getTitle: () => getText(query('title')),
    getMeta: (name) => query(`meta[name="${name}"]`).getAttribute('content'),
    getLinkHrefs: (rel) =>
      queryAll(`link[rel="${rel}"]`).map((node) => node.getAttribute('href')),
  };
};

module.exports = loadPage;
