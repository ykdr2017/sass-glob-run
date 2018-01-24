/*
 |--------------------------------------------------------------------------
 | node-sass automation
 |--------------------------------------------------------------------------
 */
var sass = require('node-sass');
var sassglob = require('node-sass-globbing');
var glob = require('glob');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var settings = {
	INPUT_PATH: './src/client/scss',
	OUTPUT_PATH: './dist/client/css',
	OUTPUT_STYLE: 'expanded',
	SOURCE_COMMENTS: true,
	OMIT_SOURCE_MAP_URL: true
};

var sassrun = {
	start: function () {
		sassrun.glob();
	},
	glob: function () {
		glob(settings.INPUT_PATH + '/**/*.scss', { ignore: './**/_*.scss' }, function (er, files) {
			if (er != null) { console.log('err:glob');console.error(er); return; }
			sassrun.mkdir(files);
		});
	},
	mkdir: function (files) {
		files.forEach(function (val, idx, arr) {
			var outPath =
					settings.OUTPUT_PATH +
					val.replace(settings.INPUT_PATH, '').replace(/(.*)\/.*\.scss/, '$1');
			mkdirp(outPath, function (er) {
				if (er != null) { console.log('err:mkdir');console.error(er); return; }
				sassrun.render(val);
			});
		});
	},
	render: function (val) {
		var outName =
				settings.OUTPUT_PATH +
				val.replace(settings.INPUT_PATH, '').replace(/(.*\/.*\.)scss/, '$1css');
		sass.render({
			file: val,
			importer: [ sassglob ],
			outFile: outName,
			outputStyle: settings.OUTPUT_STYLE,
			sourceComments: settings.SOURCE_COMMENTS,
			omitSourceMapUrl: settings.OMIT_SOURCE_MAP_URL
		}, function (er, result) {
			if (er != null) { console.log('err:render');console.error(er); return; }
			sassrun.write(outName, result);
		});
	},
	write: function (outName, result) {
		fs.writeFile(outName, '', function (er) {
			if (er != null) { console.log('err:write');console.error(er); return; }
			fs.writeFile(outName, result.css, function (er) {
				if (er != null) { console.log('err:write');console.error(er); return; }
				console.log('cssout: ', outName);
			});
		});
	}
};
sassrun.start();
