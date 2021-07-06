const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) userand password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) if ok , then send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belong to the token does not exists', 401)
    );
  }
  // 4) Check if user change password after the JWT was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password! Please login again.',
        401
      )
    );
  }

  // Grant access to the protected route
  req.user = freshUser;
  next();
});
