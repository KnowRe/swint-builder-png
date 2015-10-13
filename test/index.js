var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	assert = require('assert'),
	swintHelper = require('swint-helper'),
	buildPNG = require('../lib');

global.swintVar.printLevel = 5;

describe('builder-png', function() {
	it('Error when no callback', function() {
		assert.throws(function() {
			buildPNG({});
		});
	});

	it('Error when inDir doesn\'t exist', function(done) {
		buildPNG({
			inDir: '/this-directory-does-not-exist'
		}, function(err, res) {
			assert.notEqual(err, null);
			done();
		});
	});

	it('Simple case', function(done) {
		buildPNG({
			name: 'Test',
			inDir: path.join(__dirname, '../test_case'),
			imgMetaDir: path.join(os.tmpdir(), 'swint-builder-png-meta'),
			outDir: path.join(os.tmpdir(), 'swint-builder-png-out')
		}, function(err, res) {
			assert.deepEqual(
				fs.readFileSync(path.join(__dirname, '../test_result/meta/flags.meta.json')),
				fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-meta/flags.meta.json'))
			);

			assert.deepEqual(
				fs.readFileSync(path.join(__dirname, '../test_result/meta/browsers.meta.json')),
				fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-meta/browsers.meta.json'))
			);

			assert.deepEqual(
				fs.readFileSync(path.join(__dirname, '../test_result/out/flags.png')),
				fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-out/flags.png'))
			);

			assert.deepEqual(
				fs.readFileSync(path.join(__dirname, '../test_result/out/browsers.png')),
				fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-out/browsers.png'))
			);
			done();
		});
	});

	after(function() {
		fs.unlinkSync(path.join(os.tmpdir(), 'swint-builder-png-meta/flags.meta.json'));
		fs.unlinkSync(path.join(os.tmpdir(), 'swint-builder-png-meta/browsers.meta.json'));
		fs.unlinkSync(path.join(os.tmpdir(), 'swint-builder-png-out/flags.png'));
		fs.unlinkSync(path.join(os.tmpdir(), 'swint-builder-png-out/browsers.png'));
		fs.rmdirSync(path.join(os.tmpdir(), 'swint-builder-png-meta'));
		fs.rmdirSync(path.join(os.tmpdir(), 'swint-builder-png-out'));
	});
});
