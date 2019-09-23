const gulp        = require('gulp')
const $           = require('gulp-load-plugins')()
const fs          = require('fs-extra')
const browserSync = require('browser-sync')

const clean  = () => fs.remove('./dist')
const reload = done => {
    browserSync.reload()
    done()
}
const sync   = () => browserSync.init({ server: { baseDir: 'dist' }, reloadOnRestart: true })

const copyResource = () => gulp.src('./res/**/*').pipe(gulp.dest('./dist'))
const compileScss = () => 
    gulp.src(['./src/scss/**/*.scss', '!./src/scss/**/_*.scss'])
        .pipe($.plumber({ errorHandler: $.notify.onError("Error: <%= error.message %>") }))
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./dist'))
const compilePug = () =>
    gulp.src(['./src/pug/**/*.pug', '!./src/pug/**/_*.pug'])
        .pipe($.plumber({ errorHandler: $.notify.onError("Error: <%= error.message %>") }))
        .pipe($.pug({ pretty: true }))
        .pipe(gulp.dest('./dist'))
const compileJs = () => gulp.src(['./src/js/**/*.js']).pipe(gulp.dest('./dist'))

const watchResource = () => gulp.watch('./res/**/*',      gulp.series(copyResource, reload))
const watchScss     = () => gulp.watch('./src/scss/**/*', gulp.series(compileScss,  reload))
const watchPug      = () => gulp.watch('./src/pug/**/*',  gulp.series(compilePug,   reload))
const watchJs       = () => gulp.watch('./src/js/**/*',   gulp.series(compileJs,    reload))

const defaultFunc = gulp.series(clean, gulp.parallel(copyResource, compileScss, compilePug, compileJs))

exports.watch = gulp.series(defaultFunc, gulp.parallel(watchScss, watchResource, watchPug, watchJs, sync))
exports.default = defaultFunc