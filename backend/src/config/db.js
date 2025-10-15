const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

let cached = null;

const connectDB = async (uri) => {
  if (cached) {
    return cached;
  }

  cached = await mongoose.connect(uri);
  return cached;
};

const disconnectDB = async () => {
  if (!cached) {
    return;
  }

  await mongoose.disconnect();
  cached = null;
};

module.exports = {
  connectDB,
  disconnectDB,
};
