const express = require("express");
const response = require("./config/response");
const db = require("./config/database");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pkm-student-attachment.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);

(async () => {
  try {
    await db.authenticate();
    console.log("database connected..");
    await db.sync();
  } catch (error) {
    console.error(error);
  }
})();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
