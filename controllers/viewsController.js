const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverView = catchAsync(async (req, res, next) => {
  //1) get tour data
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', {
    title: 'The Forest Hoker Tour'
  });
};