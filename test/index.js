var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	assert = require('assert'),
	swintHelper = require('swint-helper'),
	getPixels = require("get-pixels"),
	buildPNG = require('../lib');

global.swintVar.printLevel = 5;

describe('builder-png', function() {
	this.timeout(20000);

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
			var flagExpected = JSON.parse(fs.readFileSync(path.join(__dirname, '../test_result/meta/flags.meta.json'), 'utf-8')).map(function(r) {
					delete r.timeStamp;
					return r;
				}),
				flagResult = JSON.parse(fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-meta/flags.meta.json'), 'utf-8')).map(function(r) {
					delete r.timeStamp;
					return r;
				});

			assert.deepEqual(flagExpected, flagResult);

			var browserExpected = JSON.parse(fs.readFileSync(path.join(__dirname, '../test_result/meta/browsers.meta.json'), 'utf-8')).map(function(r) {
					delete r.timeStamp;
					return r;
				}),
				browserResult = JSON.parse(fs.readFileSync(path.join(os.tmpdir(), 'swint-builder-png-meta/browsers.meta.json'), 'utf-8')).map(function(r) {
					delete r.timeStamp;
					return r;
				});

			assert.deepEqual(browserExpected, browserResult);

			getPixels(path.join(__dirname, '../test_result/out/flags.png'), function(err, flagPixelsExpected) {
				getPixels(path.join(os.tmpdir(), 'swint-builder-png-out/flags.png'), function(err, flagPixelsResult) {
					getPixels(path.join(__dirname, '../test_result/out/browsers.png'), function(err, browserPixelsExpected) {
						getPixels(path.join(os.tmpdir(), 'swint-builder-png-out/browsers.png'), function(err, browserPixelsResult) {
							assert.deepEqual(flagPixelsExpected, flagPixelsResult);
							assert.deepEqual(browserPixelsExpected, browserPixelsResult);

							done();
						});
					});
				});
			});
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
