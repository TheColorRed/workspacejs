const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const path = require('path');
const sass = require('gulp-sass');

const projects = {
    tabbar: {
        config: './src/typescript/tab-bar/tsconfig.json',
        sass: './src/sass/tab-bar/tab-bar.scss',
        watch: ['./src/typescript/tab-bar/**/*.ts']
    },
    core: {
        config: './src/typescript/core/tsconfig.json',
        watch: ['./src/typescript/core/**/*.ts']
    }
}

function makeProject(project) {
    // Create typescript project
    let tsProject = ts.createProject(project.config);
    let tsResult = tsProject.src().pipe(tsProject());
    // Save typescript to javascript
    // Compile non es6 project
    tsResult.dts.pipe(gulp.dest(path.join(__dirname, './')));
    let projectConfig = require(project.config);
    delete require.cache[require.resolve(project.config)];
    let dir = path.parse(projectConfig.compilerOptions.outFile).dir;
    // let name = path.parse(projectConfig.compilerOptions.outFile).name;
    if (project.sass) {
        // console.log(baseName);
        gulp.src(project.sass)
            .pipe(sass.sync())
            .pipe(gulp.dest(path.join(__dirname, dir)));
    }
    return tsResult.js.pipe(uglify({ mangle: true })).pipe(gulp.dest(path.join(__dirname, './')));
}

function getWatchFiles(project) {
    let f = project.watch;
    project.config ? f.push(project.config) : null;
    project.sass ? f.push(project.sass) : null;
    return f;
}

gulp.task('tabbar', () => {
    return makeProject(projects.tabbar);
})

gulp.task('core', () => {
    return makeProject(projects.core);
})

gulp.task('build', ['tabbar', 'core'], () => {
    gulp.watch(getWatchFiles(projects.tabbar), ['tabbar']);
    gulp.watch(getWatchFiles(projects.core), ['core']);
});