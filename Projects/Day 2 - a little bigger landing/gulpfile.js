const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const del = require("del");

// Clean dist folder
const clean = (cb) => {
  return del(["dist/*"], cb);
};

// Sass Task
const scssTask = () => {
  return src("app/scss/main.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
};

// JavaScript Task
const jsTask = () => {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
};

// Browsersync Tasks
const browsersyncServe = (cb) => {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
};

const browsersyncReload = (cb) => {
  browsersync.reload();
  cb();
};

// Watch Task
const watchTask = () => {
  watch("*.html", browsersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(clean, scssTask, jsTask, browsersyncReload)
  );
};

// Default Gulp task
exports.default = series(clean, scssTask, jsTask, browsersyncServe, watchTask);
