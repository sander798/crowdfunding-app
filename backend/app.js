// load .env data into process.env
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require ('./routes/projects');
//var projectApiRouter = require ('./routes/projects-api/');
//var contributionsRouter = require ('./routes/contributions')
//var contributionsApiRouter = require ('./routes/contributions-api');
var donationsRouter = require ('./routes/donations');
//var donationsApiRouter = require('./routes/donations-api');



//---------------------------------//

var app = express();
const cors=require("cors");
app.use(cors({origin: 'http://localhost:3000', credentials:true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // it should be changed to ejs then later to REact views

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
app.use(session({
     secret: 'your-secret-key',
     resave: false,
     saveUninitialized: true,
     cookie: { secure: !process.env.DEVELOPMENT } // secure: true in production over HTTPS
   }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/api/register',usersRouter)
//set routes here
app.use('/projects',projectsRouter);
app.use('/api/projects',projectsRouter);
//app.use('./contributions',contributionsRouter)
//app.use('./api/contributions',contributionsApiRouter)
app.use('./donations',donationsRouter);
//app.use('./api/donations',donationsApiRouter)
app.use('./projects/donate',projectsRouter);
//app.use('./api/projects/donate',projectApiRouter);

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
