var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
postcss = require("gulp-postcss");
autoprefixer = require("autoprefixer");
var sourcemaps = require('gulp-sourcemaps'); 
var browserSync = require('browser-sync').create(); 
cssbeautify = require('gulp-cssbeautify');
var beautify = require('gulp-beautify');


//_______ task for scss folder to css main style 
gulp.task('watch', function () {
return gulp.src('./src/assets/scss/**/*.scss')
.pipe(sourcemaps.init())
.pipe(sass())
.pipe(beautify.css({ indent_size: 4 }))
.pipe(sourcemaps.write(''))
.pipe(gulp.dest('./src/assets/css'))
}
)

gulp.task("default", gulp.series("watch"));