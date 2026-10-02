exports.notFound = (req, res) =>
  res.status(404).json({ message: "Route not found" });
exports.errorHandler = (err, req, res, next) => {
  let code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500,
    message = err.message;
  if (err.name === "ValidationError") {
    code = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    code = 404;
    message = "Not found";
  }
  if (err.code === 11000) {
    code = 409;
    message = "Already exists";
  }
  res.status(code).json({ message });
};
