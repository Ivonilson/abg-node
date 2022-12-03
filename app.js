var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/myjs', express.static(__dirname + '/public/javascripts'));
app.use('/dataTablesCss', express.static(__dirname + '/node_modules/datatables/media/css'));
app.use('/dataTablesJs', express.static(__dirname + '/node_modules/datatables/media/js'));
app.use('/dataTablesResponsive', express.static(__dirname + '/node_modules/datatables.net-responsive/js'));
app.use('/dataTablesResponsiveButtons', express.static(__dirname + '/node_modules/datatables.net-buttons/js'));
app.use(session({
  secret: 'IVONILSON',
  resave: true,
  saveUninitialized: true
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
