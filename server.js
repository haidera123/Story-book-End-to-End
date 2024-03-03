const app = require("./app");
const dotenv = require("dotenv");
// Uncaught exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require("mongoose");

// 2) DataBase Connection
dotenv.config({ path: "./config.env" });
// const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PSW);
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection successful");
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("Client connected");
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
