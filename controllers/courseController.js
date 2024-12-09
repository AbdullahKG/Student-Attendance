const { Course, sequelize } = require('../models/centralizedExports');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// this count courses for a specific department
exports.countAllCourses = catchAsync(async (req, res, next) => {
  const departmentid = req.params.departmentid;

  const totalCourse = await Course.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('courseid')), 'totalCourses'],
    ],
    where: {
      departmentid: departmentid,
    },
    raw: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalCourse,
    },
  });
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
  const course = await Course.findAll();

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.getCoursesNameOnly = catchAsync(async (req, res, next) => {
  const course = await Course.findAll({
    attributes: ['courseid', 'coursename'],
    where: {
      departmentid: req.query.departmentid,
      yearid: req.query.yearid,
      semester: req.query.semester,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create({
    coursename: req.body.coursename,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newCourse,
    },
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByPk(req.params.courseid);

  if (!course) {
    return next(
      new AppError(`there is no course for this id ${req.params.courseid}`)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const [updatedRows] = await Course.update(
    { coursename: req.body.coursename },
    {
      where: {
        courseid: req.params.courseid,
      },
    }
  );

  if (!updatedRows) {
    return next(new AppError('no rows were updated', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Course updated successfully!',
    rowsAffected: updatedRows,
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const deletedRows = await Course.destroy({
    where: {
      courseid: req.params.courseid,
    },
  });

  if (!deletedRows) {
    return next(new AppError('no rows were deleted', 404));
  }

  res.status(200).json({
    status: 'successful',
    message: `Course with courseid = (${req.params.courseid}) deleted succesfuly`,
    rowsAffected: deletedRows,
  });
});
