const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const AppError = require("./utili/appError");
const bookRouter = require("./routes/bookRoute");
const userRouter = require("./routes/userRoute");
const viewRouter = require("./routes/viewRouter");
const characterRoute = require("./routes/characterRoute");
const writingRoute = require("./routes/writingtoolroute");
const postRoute = require("./routes/postRoute");
const messageRoute = require("./routes/messageRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// register view engine
app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));
app.set("views", path.join(__dirname, "views"));
app.set(`view engine`, `ejs`);
// 1) Global Middle wares
// Set security HTTP headers
// app.use(helmet());

// Development logging
app.use(morgan("dev"));
// Body Parser
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NOSQL query injections
app.use(mongoSanitize());
// Data sanitization against XSS(Cross Browser Scripting)
app.use(xss());

// Prevent parameter polution
// Serving static files
// app.use(express.static(path.join(__dirname, "public")));

// limit requests from same API.
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});
app.use("/api", limiter);
app.use(cookieParser());

// Test Middle Ware
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// 2) Mounting
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/writingtool", writingRoute);
app.use("/api/v1/characters", characterRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/messages", messageRoute);

app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
