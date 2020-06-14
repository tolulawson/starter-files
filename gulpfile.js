const gulp = require ('gulp');
const sass = require ('gulp-sass');
const autoprefixer = require ('gulp-autoprefixer');
const uglify = require ('gulp-uglify');
const babel = require ('gulp-babel');
const htmlmin = require ('gulp-htmlmin');
const image = require('gulp-image');
const browsersync = require('browser-sync').create();
const cleancss = require('gulp-clean-css');

function promisifyStream(stream) {
    return new Promise(resolve => stream.on('end',resolve));
}


gulp.task('sass', async function() {
  await promisifyStream(
    gulp.src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
  )
});

gulp.task('cleancss', async function() {
  await promisifyStream(
    gulp.src('app/css/*.css')
      .pipe(cleancss({compatibility: 'ie8'}))
      .pipe(gulp.dest('dist/css'))
  )
})

gulp.task('autoprefixer', async function() {
  await promisifyStream(
      gulp.src('app/css/*.css', {base: './'})
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./'))
  )
})

gulp.task('babel', async function() {
  await promisifyStream(
    gulp.src('app/js/*.js')
      .pipe(babel({
          presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
      }))
      .pipe(gulp.dest('dist/js'))
  )
})

gulp.task('uglify', async function() {
  await promisifyStream(
    gulp.src('dist/js/*.js', {base: './'})
      .pipe(uglify())
      .pipe(gulp.dest('./'))
  )
})

gulp.task('htmlmin', async function() {
  await promisifyStream(
    gulp.src('app/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'))
  )
})

gulp.task('image', async function () {
  await promisifyStream(
    gulp.src('app/img/*')
    .pipe(image())
    .pipe(gulp.dest('dist/img'))
  )
})

gulp.task('browsersync', function() {
    browsersync.init({
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('start', function() {
  gulp.watch('app/scss/*.scss', {ignoreInitial: false}, gulp.series('sass', 'autoprefixer'));
  (gulp.series('browsersync'))();
})

gulp.task('build', async function() {
  (gulp.series('sass', 'autoprefixer', 'cleancss', 'babel', 'uglify', 'htmlmin', 'image'))();
});
