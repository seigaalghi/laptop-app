module.exports = (res, error) => {
  res.status(500).json({
    status: "Internal Server Error",
    message: error.message,
  });
};
