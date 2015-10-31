'use strict';

var async = require('async'),
	path = require('path'),
	fs = require('fs'),
	exec = require('child_process').exec,
	sprintf = require('sprintf').sprintf,
	swintHelper = require('swint-helper'),
	defaultize = swintHelper.defaultize,
	walk = swintHelper.walk;

module.exports = function(options, callback) {
	defaultize({
		name: 'Project',
		inDir: path.dirname(require.main.filename),
		outDir: path.join(path.dirname(require.main.filename), '../out'),
		imgMetaDir: path.join(path.dirname(require.main.filename), '../imgMeta'),
		walkOption: {
			ext: '*'
		}
	}, options);

	return proceed(options, callback);
};

var proceed = function(options, callback) {
	if(callback === undefined) {
		var msg = 'swint-builder-png function needs callback';
		print(4, msg);
		throw new Error(msg);
	}

	if(!fs.existsSync(options.inDir)) {
		callback('swint-builder-png: inDir doesn\'t exist', false);
		return;
	}

	if(!fs.existsSync(options.outDir)) {
		fs.mkdirSync(options.outDir);
	}

	if(!fs.existsSync(options.imgMetaDir)) {
		fs.mkdirSync(options.imgMetaDir);
	}

	var dirList = fs.readdirSync(options.inDir).filter(function(dir) {
			return fs.lstatSync(path.join(options.inDir, dir)).isDirectory();
		}),
		walkers = dirList.map(function(dir) {
			var walkOption = options.walkOption;
			walkOption.dir = path.join(options.inDir, dir);
			return walk(walkOption);
		}),
		imgMeta = dirList.map(function(dir, idx) {
			var filePath = walkers[idx],
				offset = 0;

			return filePath.map(function(file) {
				var buff = fs.readFileSync(file),
					width = buff.readUInt32BE(16);
				
				offset += width;

				return {
					name: path.basename(file),
					timeStamp: fs.statSync(file).ctime,
					width: width,
					height: buff.readUInt32BE(20),
					offset: offset - width
				};
			});
		});

	async.parallel(
		dirList.map(function(dir, idx) {
			return function(callback) {
				var filePath = walkers[idx],
					metaFile = path.join(options.imgMetaDir, sprintf('%s.meta.json', dir));

				if(fs.existsSync(metaFile) && (fs.readFileSync(metaFile, 'utf8') === JSON.stringify(imgMeta[idx]))) {
					callback(null, true);
					return;
				}

				fs.writeFileSync(metaFile, JSON.stringify(imgMeta[idx]));

				exec(
					sprintf('montage -background transparent -mode concatenate -tile x1 %s %s',
						filePath.map(function(p) {
							return '"' + p + '"';
						}).join(' '),
						path.join(options.outDir, sprintf('%s.png', dir))
					),
					function(err, stdout, stderr) {
						if(stderr) print(stderr);
						callback(null, true);
					}
				);
			};
		}),
		function(err, results) {
			callback(err, results);
		}
	);
};

