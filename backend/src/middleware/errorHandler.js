const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  console.error("API error", err);
  const status = err.status || 500;
  const payload = {
    message: err.message || "Internal server error",
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    payload.stack = err.stack;
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json(payload);
};

module.exports = {
  notFound,
  errorHandler,
};
