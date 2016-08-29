var gulp = require("gulp");
var ts = require("gulp-typescript");

var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    var tsResult = tsProject.src().pipe(ts(tsProject));
    tsResult.js.pipe(gulp.dest("lib"));
    tsResult.dts.pipe(gulp.dest("lib"));
    return tsResult;    
});

gulp.task('watch', function() {
    gulp.watch("src/**/*.ts", ['default']);
});