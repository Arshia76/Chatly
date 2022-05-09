const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );
    return next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'خطای اعتبارسنجی', error: err.errors });
  }
};

module.exports = validate;
