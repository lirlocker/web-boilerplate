import gulp		from 'gulp';
import gutil	from 'gulp-util';
import jshint	from 'gulp-jshint';
import babel	from 'gulp-babel';
import webpack	from 'gulp-webpack';
import path		from 'path';

const sourceDir	= 'source/';
const destDir	= 'public/';

const materials = {
	js: {
		source: path.join(sourceDir, 'js/**/*.js'),
		dest: 	path.join(destDir, 'js'),
		tasks:	['jsHandle'],
	},
	html: {
		source: path.join(sourceDir, '*.html'),
		dest:	destDir,
		tasks:	['htmlHandle'],
	},
	css: {
		source: path.join(sourceDir, 'css/**/*.css'),
		dest:	path.join(destDir, 'css/'),
		tasks:	['cssCopy'],
	},
};


// Default Task
gutil.log('Gulp is running!');
gulp.task('default', ['watch']);


// Watching

gulp.task('watch', () => {
	gutil.log('Watching for changes.');

	// Watch the first element in the array, and use the tasks in the second.
	for (let prop in materials) {
		gulp.watch(prop.source, prop.tasks);
	};
});


// Material Handling

gulp.task('htmlHandle', () => {
    gulp.src(materials.html.source).pipe(gulp.dest(htmlDest));
});

gulp.task('cssHandle', () => {
    gulp.src(cssGlob).pipe(gulp.dest(cssDest));
});

gulp.task('jsHandle', () => {
    gulp.src(jsGlob)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
        .pipe(babel())
        .pipe(gulp.dest(jsdest));
});
