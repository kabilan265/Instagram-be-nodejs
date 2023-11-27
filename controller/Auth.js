const asyncHandler = require('../middleware/async');
const ErrResponse = require('../utils/ErrorResponse')
const User = require('../modal/User')

exports.signUp = asyncHandler(async function (req, res, next) {
  console.log(req.body)
  const user = await User.create(req.body);
  const token = await user.getSignedInToken();
  return res.status(200).json({ sucess: true, token })
})

exports.loginIn = asyncHandler(async function (req, res, next) {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).select('+password');

  if (!user) {
    return next(new ErrResponse('Invalid Credentials', 401))
  }

  const isMatch = await user.passwordChecker(password)
  if (!isMatch) {
    return next(new ErrResponse('Invalid Credentials', 401))
  }
  const token = await user.getSignedInToken();
  return res.status(200).json({ sucess: true, token })

})