var gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserSync = require("browser-sync"),
    useref = require("gulp-useref"),
    uglify = require("gulp-uglify"),
    gulpIf = require("gulp-if"),
    concatCss = require("gulp-concat-css"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    cache = require("gulp-cache"),
    del = require("del"),
    runSequence = require("gulp-sequence");


gulp.task("sass", function () {
    return gulp.src("app/sass/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task("browserSync", function () {
    browserSync({
        server: {
            baseDir: "app"
        },
    })
});


gulp.task("watch", ["browserSync", "sass"], function () {
    gulp.watch("app/sass/**/*.scss", ["sass"]);
    gulp.watch("app/*.html", browserSync.reload);
    gulp.watch("app/js/**/*.js", browserSync.reload);
});


gulp.task("useref",function(){
   
    return gulp.src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cleanCSS()))
    
    .pipe(gulp.dest("dist"));
});

gulp.task("images", function(){
    return gulp.src("app/img/**/*.+(png|jpg|jpeg)")
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest("dist/img"))
});

gulp.task("fonts",function(){
    return gulp.src("app/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"))
});

gulp.task("clean:dist", function(callback){
    del(["dist/**/*", "!dist/img","!dist/img/**/*"], callback)
});


gulp.task("build", ["clean:dist", "sass", "useref", "images", "fonts"])



