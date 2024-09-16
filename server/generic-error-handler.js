const genericErrorHandler = (err, req, res, next) => {
    res.status(404).send(err.message);
  };

module.exports = genericErrorHandler;