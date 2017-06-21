import sass             from 'gulp-sass';
import gulp			    from 'gulp';
import gutil		    from 'gulp-util';
import eslint		    from 'gulp-eslint';
import babel		    from 'gulp-babel';
import webserver		from 'gulp-webserver';
import path				from 'path';
import webpack 			from 'webpack';
import UglifyJSPlugin	from 'uglifyjs-webpack-plugin';
import {userConfig}		from './package.json';
import webpackConfig 	from './webpack.config.babel.js';

userConfig.production = !!gutil.env.production;

const materials = {
	js: {
		source: path.join(userConfig.sourceDir, 'js/**/*.js*'),
		dest: 	path.join(userConfig.destDir, 'js'),
		tasks:	['jsHandle', 'jsLinting'],
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
	sass: {
		source: path.join(userConfig.sourceDir, 'sass/**/*.scss'),
		dest:	path.join(userConfig.destDir, 'css/'),
		tasks: ['sassHandle'],
	},
	resources: {
		source: path.join(userConfig.sourceDir, 'resources/**/*.*'),
		dest:   path.join(userConfig.destDir, 'resources/'),
		tasks: ['copyResources'],
	}
};


// Default Task
gutil.log('Gulp is running!');
gulp.task('default', ['htmlHandle', 'copyResources', 'cssHandle', 'jsHandle', 'sassHandle', 'watch', 'webserver']);

// Web Server
gulp.task('webserver', () => {
	gulp.src(userConfig.destDir)
	.pipe(webserver(userConfig.gulpWebserverConfig));
});

// Watching

gulp.task('watch', () => {
	gutil.log('Watching for changes.');
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
    gulp.src(materials.css.source).pipe(gulp.dest(materials.css.dest));
});
gulp.task('sassHandle', () => {
	gulp.src(materials.sass.source)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(materials.sass.dest))
	;
});

gulp.task('jsLinting', () => {
    gulp.src(materials.js.source)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('jsHandle', () => {
	if (userConfig.production) {
		webpackConfig.plugins = [
			new UglifyJSPlugin({
				sourceMap: true
			})
		];
	}
	// This packs the JS files, transpiles and uglifies them.
	webpack(webpackConfig, (err, stats) => {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString());
	});
});
gulp.task('copyResources', () => {
	gulp.src(materials.resources.source)
		.pipe(gulp.dest(materials.resources.dest))
	;
});
