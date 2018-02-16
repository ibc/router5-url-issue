/**
 * Tasks:
 *
 * gulp live
 *   Generates the browser app, opens it in the browser and watches for
 *   changes in the source code.
 *
 * gulp
 *   Alias for `gulp live`.
 */

const path = require('path');
const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');

const PKG = require('./package.json');
const OUTPUT_DIR = 'out';

gulp.task('bundle', () =>
{
	let bundler = browserify(
		{
			entries      : PKG.main,
			extensions   : [ '.js' ],
			debug        : true,
			cache        : {},
			packageCache : {},
			fullPaths    : true
		});

	bundler = watchify(bundler);

	bundler.on('update', () =>
	{
		const start = Date.now();

		console.log('>>> bundling...');
		rebundle();
		console.log('>>> bundle took %sms', (Date.now() - start));
	});

	function rebundle()
	{
		return bundler.bundle()
			.on('error', (error) => console.error(error))
			.pipe(source(`${PKG.name}.js`))
			.pipe(buffer())
			.pipe(gulp.dest(OUTPUT_DIR));
	}

	return rebundle();
});

gulp.task('html', () =>
{
	return gulp.src('index.html')
		.pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('livebrowser', (done) =>
{
	browserSync(
		{
			startPath : '/Microsoft',
			server    :
			{
				baseDir : OUTPUT_DIR,
				routes  :
				{
					'/Microsoft'       : OUTPUT_DIR,
					'/Microsoft/login' : OUTPUT_DIR
				}
			},
			notify    : true,
			ghostMode : false,
			files     : path.join(OUTPUT_DIR, '**', '*')
		});

	done();
});

gulp.task('watch', (done) =>
{
	// Watch changes in HTML.
	gulp.watch([ 'index.html' ], gulp.series(
		'html'
	));

	done();
});

gulp.task('live', gulp.series(
	'bundle',
	'html',
	'watch',
	'livebrowser'
));

gulp.task('default', gulp.series('live'));
