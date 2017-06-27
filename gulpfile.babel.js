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
import autoprefixer		from 'autoprefixer';
import postcss 			from 'gulp-postcss';

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
		tasks:	['cssHandle', 'autoPrefix'],
	},
	sass: {
		source: path.join(userConfig.sourceDir, 'sass/**/*.scss'),
		dest:	path.join(userConfig.destDir, 'css/'),
		tasks: ['sassHandle', 'autoPrefix'],
	},
	assets: {
		source: path.join(userConfig.sourceDir, 'assets/**/*.*'),
		dest:   path.join(userConfig.destDir, 'assets/'),
		tasks: ['copyAssets'],
	},
    lib: {
		source: path.join(userConfig.sourceDir, 'lib/**/*.*'),
		dest:   path.join(userConfig.destDir, 'lib/'),
		tasks: ['copyLib'],
	}
};


// Default Task
gutil.log('Gulp is running!');
gulp.task('default', ['htmlHandle', 'copyLib', 'copyAssets', 'cssHandle', 'jsHandle', 'sassHandle', 'watch', 'webserver']);

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
    gulp.src(materials.html.source)
		.pipe(gulp.dest(materials.html.dest))
	;
});

gulp.task('cssHandle', () => {
    gulp.src(materials.css.source)
		.pipe(gulp.dest(materials.css.dest))
	;
});
gulp.task('sassHandle', () => {
	gulp.src(materials.sass.source)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(materials.sass.dest))
	;
});
gulp.task('autoPrefix', () => {
	gulp.src(materials.css.dest, {base: "./"})
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./"))
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
gulp.task('copyAssets', () => {
	gulp.src(materials.assets.source)
		.pipe(gulp.dest(materials.assets.dest))
	;
});
gulp.task('copyLib', () => {
	gulp.src(materials.lib.source)
		.pipe(gulp.dest(materials.lib.dest))
	;
});
