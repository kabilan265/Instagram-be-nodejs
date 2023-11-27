const ErrResponse = require('../utils/ErrorResponse');

const errHandler = (err, req, res, next)=>{
  console.log(err)
  let error = {...err};
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue);
    let message = 'Duplicate field value entered';
    if(keys.includes('email'))
    {
      message = 'Another account is using the same email.';
    }
    else
    {
      message = `This username isn't available. Please try another.`;
    }
    
    error = new ErrResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrResponse(message, 400);
  }

  return res.status(error.code || 500).json({
    sucess: false,
    error: error.message || 'Internal server error'
  })
}

module.exports = errHandler;
