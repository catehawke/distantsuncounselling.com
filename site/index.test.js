const test = require('ava');
const loadPage = require('../utils/loadPage');

const page = loadPage('./index.html');

test('html is correct langauge', (t) => {
  t.is(page.getRootAttrs().lang, 'en');
});

test('header has correct meta information', (t) => {
  t.is(page.getTitle(), 'Distant Sun Counselling - website coming');
  //   t.is(page.getMeta('description'), 'TBC');
});

test('header has expected stylesheets', (t) => {
  const stylesheets = page.getLinkHrefs('stylesheet');

  t.is(stylesheets.length, 2);
  t.regex(stylesheets[0], /^https:\/\/fonts.googleapis.com\/css\?(.*)/);
  t.regex(stylesheets[1], /^\/assets\/(.*).css$/);
});

test('has header logo', (t) => {
  const logo = page.query('header img.header-logo');
  const attrs = page.getAttrs(logo);

  t.is(attrs.alt, 'Distant Sun Counselling');
  t.is(attrs.src, '/svg/primary-logo.svg');
});

test('has main content', (t) => {
  const main = page.query('main');
  t.true(
    page.containsText(
      main,
      'My name is Cate Hawke and I’m a relational integrative counsellor'
    )
  );
});

test('has contacts in footer', (t) => {
  const mailto = page.query('footer a[href^="mailto:"]');
  const phone = page.query('footer a[href^="tel:"]');

  t.true(page.containsText(mailto, '@distantsuncounselling.com'));
  t.true(page.containsText(phone, '+44'));
});
