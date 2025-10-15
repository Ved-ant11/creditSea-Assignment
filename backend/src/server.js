require("dotenv").config();
const http = require("http");

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function start() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/creditsea";
    await connectDB(mongoUri);
    server.listen(PORT, () => {
      console.log(`API ready on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failure", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

module.exports = { start, server };
