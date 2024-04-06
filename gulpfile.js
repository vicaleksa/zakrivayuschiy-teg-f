const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

function pug() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };
  return gulp.src('src/pages/**/*.pug')
    .pipe(gulpPug({
      pretty: true,
    }))
    // .pipe(plumber())
    // .on('data', function (file) {
    //   const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
    //   return file.contents = buferFile
    // })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({ stream: true }));
}

function layoutsScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    //cssnano()
  ];
  return gulp.src('src/layouts/**/*.scss')
    .pipe(sass())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function pagesScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    //cssnano()
  ];
  return gulp.src('src/pages/**/*.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}', { encoding: false })
    .pipe(gulp.dest('dist/images/'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch([
    'src/pages/**/*.pug',
    'src/layouts/**/*.pug',
    'src/components/**/*.pug'
  ], pug);
  gulp.watch(['src/scripts/**/*.js'], scripts);
  gulp.watch([
    'src/layouts/**/*.scss',
    'src/styles/**/*.scss'
], layoutsScss);
  gulp.watch(['src/pages/**/*.scss', 'src/components/**/*.scss'], pagesScss);
  gulp.watch(['src/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}'], images);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(pug, scripts, layoutsScss, pagesScss, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.pug = pug;
exports.scripts = scripts;
exports.layoutsScss = layoutsScss;
exports.pagesScss = pagesScss;
exports.images = images;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
