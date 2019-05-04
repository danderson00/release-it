const test = require('ava');
const mockStdIo = require('mock-stdio');
const Log = require('../lib/log');

test('should write to stdout', t => {
  const log = new Log();
  mockStdIo.start();
  log.log('foo');
  const { stdout, stderr } = mockStdIo.end();
  t.is(stdout.trim(), 'foo');
  t.is(stderr, '');
});

test('should write to stderr', t => {
  const log = new Log();
  mockStdIo.start();
  log.error('foo');
  const { stdout, stderr } = mockStdIo.end();
  t.is(stdout.trim(), '');
  t.true(stderr.trim().endsWith('foo'));
});

test('should print warning', t => {
  const log = new Log();
  mockStdIo.start();
  log.warn('foo');
  const { stdout } = mockStdIo.end();
  t.true(stdout.trim().endsWith('foo'));
});

test('should print verbose', t => {
  const log = new Log({ isVerbose: true });
  mockStdIo.start();
  log.verbose('foo');
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), 'foo');
});

test('should not print verbose by default', t => {
  const log = new Log();
  mockStdIo.start();
  log.verbose('foo');
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '');
});

test('should not print command execution by default', t => {
  const log = new Log();
  mockStdIo.start();
  log.exec('foo');
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '');
});

test('should print command execution (verbose)', t => {
  const log = new Log({ isVerbose: true });
  mockStdIo.start();
  log.exec('foo');
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '$ foo');
});

test('should print command execution (dry run)', t => {
  const log = new Log({ isDryRun: true });
  mockStdIo.start();
  log.exec('foo');
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '$ foo');
});

test('should print command execution (read-only)', t => {
  const log = new Log({ isDryRun: true });
  mockStdIo.start();
  log.exec('foo', 'bar', false);
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '$ foo bar');
});

test('should print command execution (write)', t => {
  const log = new Log({ isDryRun: true });
  mockStdIo.start();
  log.exec('foo', '--arg n', true);
  const { stdout } = mockStdIo.end();
  t.is(stdout.trim(), '! foo --arg n');
});

test('should not print log output when in quiet mode', t => {
  const log = new Log({ isQuiet: true });
  mockStdIo.start();
  log.log('foo');
  const { stdout, stderr } = mockStdIo.end();
  t.is(stdout.trim(), '');
  t.is(stderr.trim(), '');
});

test('should print errors when in quiet mode', t => {
  const log = new Log({ isQuiet: true });
  mockStdIo.start();
  log.error('foo');
  const { stdout, stderr } = mockStdIo.end();
  t.is(stdout.trim(), '');
  t.true(stderr.trim().endsWith('foo'));
});
