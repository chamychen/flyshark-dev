//*********************依赖start*****************************
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const gulpUtil = require('gulp-util');
const ts = require("gulp-typescript");
const glob = require('glob');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
//*********************依赖end*****************************

const dev = true;//是否开发环境
const isCygProd = false;//是否模拟生产环境
let isPrintWitch = false;//是否启用打印

const $ = gulpLoadPlugins();
const reload = browserSync.reload;// 自动刷新函数


//开发环境调用(由于开发环境不执行压缩，其速度更快)
let devTask = function (task) {
  return dev ? task : gulpUtil.noop();
};

//生产环境调用(由于生产环境执行压缩，其速度更慢)
let prodTask = function (task) {
  return !dev ? task : gulpUtil.noop();
};

//打印
let printWitch = function () {
  const print = $.print.default;//打印 
  return isPrintWitch ? print() : gulpUtil.noop();
}

//系统路径
let system_paths = {
  sass: { all: 'app/styles/**/*.scss', compile: ['app/styles/**/*.scss'], tmp: ['.tmp/styles/**'] },
  ts: { all: 'app/typescripts/**/*.ts', compile: 'app/typescripts/**/*-entry.ts', tmp: ['.tmp/scripts/**'] },
  css: ['dist/**/*.css', '!dist/**/*.min.css'],
  js: ['dist/**/*.js', 'dist/**/*.min.js'],
  html: ['dist/**/*.html'],
  image: ['dist/images/**']
}

//清除
gulp.task('clean', function () {
  console.log("***************RUN clean************************");
  return del(['dist', '.tmp']);
})

//编译sass
gulp.task('sass', () => {
  console.log("***************RUN sass************************");
  return gulp.src(system_paths.sass.compile)
    .pipe($.plumber())//编译容错处理                              
    .pipe($.if(dev, $.sourcemaps.init({ loadMaps: true })))//仅开发环境输出sourcemap
    .pipe($.sass.sync({
      outputStyle: 'expanded',//编译方式：嵌套输出方式 nested，展开输出方式 expanded，紧凑输出方式 compact，压缩输出方式 compressed
      precision: 10,//浮点数输出精度
      includePaths: ['.']
    }).on('error', $.sass.logError)) //Sass编译处理                            
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))//css浏览器前缀添加
    .pipe($.if(dev, $.sourcemaps.write('./')))//仅开发环境输出sourcemap
    .pipe(printWitch())
    .pipe(gulp.dest('.tmp/styles'));
});


//TypeScript编译
gulp.task('ts', (done) => {
  console.log("***************RUN ts************************");
  glob(system_paths.ts.compile, function (err, files) {
    if (err) done(err);
    var entrys = files.map(function (entry) {
      return entry;
    });

    for (var i = 0; i < entrys.length; i++) {
      compileTS(entrys[i]);
    }
  })

  done();

  //单个入口点编译
  function compileTS(fileName) {
    var outFileName = fileName.replace("app/typescripts/", "").replace(".ts", ".js");
    gulp.src(fileName)
      .pipe($.if(dev, $.sourcemaps.init({ loadMaps: true })))//仅开发环境输出sourcemap
      .pipe(ts({
        noImplicitAny: true,
        target: "es5",
        out: outFileName
      }))
      .pipe(printWitch())
      .pipe($.if(dev, $.sourcemaps.write('./')))//仅开发环境输出sourcemap
      .pipe(gulp.dest('.tmp/scripts'));
  }
})

//压缩图片
gulp.task('imagemin', () => {
  return gulp.src('dist/images/**/*')
    .pipe($.cached('imagemin'))
    .pipe($.imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）  
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片  
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染  
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化  
    }))
    .pipe(printWitch())
    .pipe(gulp.dest('dist/images'));
});

//复制文件
gulp.task('copy', () => {
  return gulp.src(["app/**", ".tmp/**", "!app/**/*.scss", "!app/**/*.ts"], { since: gulp.lastRun('copy') })
    .pipe($.cached('copy'))
    .pipe(printWitch())
    .pipe(gulp.dest("dist"));
})

//压缩混淆JS
gulp.task('script', function () {
  console.log("***************RUN script************************");
  return gulp.src(system_paths.js, { since: gulp.lastRun('script') }
  )
    .pipe($.cached('script'))
    .pipe(printWitch())
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
})

//压缩css
gulp.task('css', function () {
  console.log("***************RUN css************************");
  return gulp.src(system_paths.css, { since: gulp.lastRun('css') })
    .pipe($.cached('css'))//缓存文件,并只会读取更新过的文件
    .pipe(printWitch())
    .pipe($.cssnano())//压缩css
    .pipe(gulp.dest('dist'));
})


//rev
gulp.task('rev', function () {
  console.log("***************RUN rev************************");
  //此方法不可以使用cached，因为Cached只对修改过的文件进行重替，
  //（但在此处，我们可能因为CSS/JS修改需要将html文件中的hashid升级）
  return gulp
    .src(system_paths.html)
    .pipe(printWitch())
    .pipe($.revAppend())//替换JS/CSS路径
    .pipe(gulp.dest('dist'))
  //.pipe(reload({ stream: true }));
})

//生成发布包
gulp.task("publish", function () {
  console.log("***************RUN publish************************");
  var name = 'publish-' + dateFtt(new Date(), 'yyyyMMddhhmmss') + '.zip';
  return gulp.src('dist/**', { since: gulp.lastRun('publish') })
    .pipe($.cached("publish"))
    .pipe($.plumber())
    .pipe($.remember("publish"))
    .pipe(printWitch())
    .pipe($.zip(name))
    .pipe(gulp.dest('release'));
});


// 定义web服务模块，增加浏览器同步浏览
gulp.task('browser-sync', function () {
  console.log("***************RUN browser-sync************************");
  browserSync({
    server: {
      baseDir: 'dist',
      index: "index.html",
    },
  });

  isPrintWitch = true;

  //监测ts
  gulp.watch([system_paths.ts.all]).
    on('change',
      gulp.series(
        'ts',
        'copy',
        isCygProd ?
          gulp.series(gulp.parallel('imagemin', 'css', 'script'), 'rev') :
          gulp.series('rev')));


  //监测sass
  gulp.watch([system_paths.sass.all]).
    on('change',
      gulp.series(
        'sass',
        'copy',
        isCygProd ?
          gulp.series(gulp.parallel('imagemin', 'css', 'script'), 'rev') :
          gulp.series('rev')));


  //监测app文件夹
  gulp.watch(['app/**', system_paths.ts.all, system_paths.sass.all]).
    on('change',
      gulp.series(
        'copy',
        isCygProd ?
          gulp.series(gulp.parallel('imagemin', 'css', 'script'), 'rev') :
          gulp.series('rev')));

});

//执行任务
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('sass', 'ts'),
  'copy',
  dev ?
    isCygProd ? gulp.series(gulp.parallel('imagemin', 'css', 'script'), 'rev', 'browser-sync') : gulp.series('rev', 'browser-sync')
    : gulp.series(gulp.parallel('imagemin', 'css', 'script'), 'rev', 'publish')
));


//日期格式化
function dateFtt(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

