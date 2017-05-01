import gulp			    from 'gulp';
import gutil		    from 'gulp-util';
import jshint		    from 'gulp-jshint';
import babel		    from 'gulp-babel';
import webpack			from 'gulp-webpack';
import webserver		from 'gulp-webserver';
import path				from 'path';
import UglifyJSPlugin	from 'uglifyjs-webpack-plugin';
import {userConfig}		from './package.json';

const materials = {
	js: {
		source: path.join(userConfig.sourceDir, 'js/**/*.js*'),
		dest: 	path.join(userConfig.destDir, 'js'),
		tasks:	['jsHandle', 'jsHint'],
	},
	html: {
		source: path.join(userConfig.sourceDir, '*.html'),
		dest:	userConfig.destDir,
		tasks:	['htmlHandle'],
	},
	css: {
		source: path.join(userConfig.sourceDir, 'css/**/*.css'),
		dest:	path.join(userConfig.destDir, 'css/'),
		tasks:	['cssHandle'],
	},
};


// Default Task
gutil.log('Gulp is running!');
gulp.task('default', ['htmlHandle', 'cssHandle', 'jsHandle', 'watch', 'webserver']);

// Web Server
gulp.task('webserver', () => {
  gulp.src(userConfig.destDir)
    .pipe(webserver(userConfig.gulpWebserverConfig));
});

// Watching

gulp.task('watch', () => {
	gutil.log('Watching for changes.');

	// Watch the first element in the array, and use the tasks in the second.
	for (let prop in materials) {
		let prop = materials[prop];
		gulp.watch(prop.source, prop.tasks);
	};
});


// Material Handling

gulp.task('htmlHandle', () => {
    gulp.src(materials.html.source).pipe(gulp.dest(materials.html.dest));
});

gulp.task('cssHandle', () => {
    gulp.src(materials.css.source).pipe(gulp.dest(materials.html.dest));
});

gulp.task('jsHint', () => {
    gulp.src(materials.js.source)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jsHandle', () => {
	// This packs the JS files, transpiles and uglifies them.
	gulp.src(userConfig.entryPoint)
		.pipe(webpack({
		    output: {
		        filename: userConfig.bundleFilename,
		    },
		    module: {
		        loaders: [{
		                test: /\.jsx?$/,
		                loader: 'babel-loader',
		        }]
		    },
		    plugins: [
		        new UglifyJSPlugin({
					sourceMap: true
				})
		    ],
		    stats: {
		        colors: true
		    },
		    devtool: 'source-map'
		}))
		.pipe(gulp.dest(userConfig.bundleDest));
});
