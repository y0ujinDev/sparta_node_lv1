const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    })
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

module.exports = connect;
