
const fs = require('fs'),
	dotenv = require('../index'),
	assert = require('assert');

const parsed = dotenv.parse(fs.readFileSync('test/.env', {encoding: 'utf8'}));

assert.strictEqual(parsed.BASIC, 'basic');
assert.strictEqual(parsed.AFTER_LINE, 'after_line');
assert.strictEqual(parsed.EMPTY, '');
assert.strictEqual(parsed.SINGLE_QUOTES, 'single_quotes');
assert.strictEqual(parsed.SINGLE_QUOTES_SPACED, '    single quotes    ');
assert.strictEqual(parsed.DOUBLE_QUOTES, 'double_quotes');
assert.strictEqual(parsed.DOUBLE_QUOTES_SPACED, '    double quotes    ');
assert.strictEqual(parsed.EXPAND_NEWLINES, 'expand\nnew\nlines');
assert.strictEqual(parsed.DONT_EXPAND_UNQUOTED, 'dontexpand\\nnewlines');
assert.strictEqual(parsed.DONT_EXPAND_SQUOTED, 'dontexpand\\nnewlines');
assert.strictEqual(parsed.COMMENTS, undefined);
assert.strictEqual(parsed.EQUAL_SIGNS, 'equals==');
assert.strictEqual(parsed.RETAIN_INNER_QUOTES, '{"foo": "bar"}');
assert.strictEqual(parsed.RETAIN_LEADING_DQUOTE, '"retained');
assert.strictEqual(parsed.RETAIN_LEADING_SQUOTE, '\'retained', 'retains leading single quote');
assert.strictEqual(parsed.RETAIN_TRAILING_DQUOTE, 'retained"');
assert.strictEqual(parsed.RETAIN_TRAILING_SQUOTE, 'retained\'', 'retains trailing single quote');
assert.strictEqual(parsed.RETAIN_INNER_QUOTES_AS_STRING, '{"foo": "bar"}');
assert.strictEqual(parsed.TRIM_SPACE_FROM_UNQUOTED, 'some spaced out string');
assert.strictEqual(parsed.USERNAME, 'therealnerdybeast@example.tld');
assert.strictEqual(parsed.SPACED_KEY, 'parsed');

[
	'SERVER=localhost\rPASSWORD=password\rDB=tests\r',
	'SERVER=localhost\nPASSWORD=password\nDB=tests\n',
	'SERVER=localhost\r\nPASSWORD=password\r\nDB=tests\r\n'
].map((a) => {
	assert.strictEqual(JSON.stringify(dotenv.parse(a)), JSON.stringify({SERVER: 'localhost', PASSWORD: 'password', DB: 'tests'}));
});
