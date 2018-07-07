const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourceMaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const skip = require('./gulp_skip');

let __DEVE__ = false;
let __TEST__ = false;

switch(process.env.NODE_ENV){
    case 'production': break;
    case 'staging': break;
    case 'test': __TEST__ = true;
        break;
    default: __DEVE__ = true;
}

const src = path.resolve('src');
const testDir = path.resolve('test');
const buildPath = path.resolve('lib');
const srcFiles = `${src}/**/*.*`;
const srcJS = `${src}/**/*.js`;

const subTestDirectory = '';

const task =  {
    clearCache(){
        return cache.clearAll();
    },
    test(){
        return gulp.src(getTestFiles(subTestDirectory), {read: false})
            .pipe(mocha(mochaConfig(true)))
    },
    testBeforeWatch(done){
        return gulp.src(getTestFiles(subTestDirectory), {read: false})
            .pipe(mocha(mochaConfig(true)))
            .once('error', () => {
                done();
            })
    },
    lint(){
        return gulp.src([srcJS,'!node_modules/**'])
            .pipe(eslint())
            .pipe(eslint.format())
    },
    babel(){
        return gulp.src(srcFiles)
            .pipe(sourceMaps.init())
            .pipe(plumber())
            .pipe(doBabel())
            .pipe(doUglify())
            .pipe(sourceMaps.write(__DEVE__ ? null : '.'))
            .pipe(gulp.dest(buildPath))
    },
    build(done){
        runSequence('lint', 'babel', done);
    },
    dev(){
        return gulp.watch([srcJS], ['build']);
    },
    testWatch(){
        return watch(['./test/**/*.js', srcJS], {
            name: 'mocha',
            ignoreInitial: true,
        }, function() {
            gulp.src(getTestFiles(subTestDirectory), {read: false})
                .pipe(plumber())
                .pipe(mocha(mochaConfig(true)))
        });
    },
    default(done){
        runSequence('clear-cache', 'build', 'test', done);
    },
};

module.exports = task;

function doBabel(){
    if(__DEVE__ || __TEST__){
        return cache(babel())
    }
    return babel();
}

function doUglify(){
    console.log('test', __TEST__);
    if(__DEVE__){
        return skip()
    }
    return uglify({
        compress: {
            drop_console: __TEST__,
        },
    })
}

function getTestFiles(subDir, fileKey = 'test'){

    const fileType = `**/*.${fileKey}.js`;

    if(!subDir){
        return `${testDir}/${fileType}`
    }

    const subTestDir = `${testDir}/${subDir}`;

    if(!fs.existsSync(subTestDir)){
        throw(new Error(`sub test directory does not exist: ${subTestDir}`))
    }

    return `${subTestDir}/${fileType}`
}

function mochaConfig(exit, ui = 'bdd'){
    return {
        exit,
        ui,
        bail: false,
        require: [ 'babel-core/register' ],
    };
}
