var paths = {
 'SOURCE': './resources/assets/',
 'DESTINATION': './public/assets/',
 'BOWER': './vendor/bower_components/'
}

var gulp = require('gulp'),
    gulpif = require('gulp-if'), // if --production flag
    argv = require('yargs').argv, // allow for command line arguments
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'), // clean paths.DESTINATION before running
    watch = require('gulp-watch');


gulp.task('styles', function() {
  return gulp.src(paths.SOURCE + 'sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        style: 'expanded',
        includePaths : [
               paths.BOWER + 'normalize-scss',
               paths.BOWER + 'sassyflex/sass'
           ]
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulpif(argv.production, minifycss()))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.DESTINATION + 'css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {

  return gulp.src(paths.SOURCE + 'js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.DESTINATION + 'js'))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.DESTINATION + 'js'))
    .pipe(notify({ message: 'Scripts task complete' }));

});

gulp.task('bower-scripts', function() {
  return gulp.src([
        paths.BOWER + 'jquery/dist/jquery.js',
        paths.BOWER + 'modernizr/modernizr.js'
    ])
    .pipe(sourcemaps.init())
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(paths.DESTINATION + 'js'))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.DESTINATION + 'js'))
    .pipe(notify({ message: 'Bower Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src(paths.SOURCE + 'images/**/*')
    .pipe(cache(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(paths.DESTINATION + 'images'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('watch', function() {

  gulp.watch(paths.SOURCE + 'sass/**/*.scss', ['styles']);
  gulp.watch(paths.SOURCE + 'js/**/*.js', ['scripts']);
  gulp.watch(paths.SOURCE + 'images/**/*', ['images']);

});


gulp.task('clean', function(cb) {
    del(paths.DESTINATION, cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'bower-scripts', 'images');
});

