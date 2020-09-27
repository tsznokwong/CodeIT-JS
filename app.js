require("babel-register");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var square = require("./routes/square").default;
var salidSpree = require("./routes/salad-spree").default;
var fruitBasket = require("./routes/fruit-basket").default;
var gmo = require("./routes/gmo").default;
var cleanFloor = require("./routes/clean-floor").default;
var slsm = require("./routes/slsm").default;
var trace = require("./routes/contact-trace").default;
var boredScribe = require("./routes/bored-scribe").default;
var yinYang = require("./routes/yin-yang").default;
var driverlessCar = require("./routes/driveless-car").default;
var supermarket = require("./routes/supermarket").default;

var index = require("./routes/index");
var users = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
// app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/square", square);
app.use("/salad-spree", salidSpree);
app.use("/fruitbasket", fruitBasket);
app.use("/intelligent-farming", gmo);
app.use("/clean_floor", cleanFloor);
app.use("/slsm", slsm);
app.use("/contact_trace", trace);
app.use("/bored-scribe", boredScribe);
app.use("/yin-yang", yinYang);
app.use("/driverless-car", driverlessCar);
app.use("/supermarket", supermarket);

// catch 404 and forward to error handler`
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
