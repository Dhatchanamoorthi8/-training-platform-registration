
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const StudentCourse = require('../models/StudentCourse');


router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
});


router.post('/:id/enroll', async (req, res, next) => {
  try {
    const studentCourse = new StudentCourse({
      student_id: req.params.id,
      course_id: req.body.course_id
    });
    await studentCourse.save();
    res.json(studentCourse);
  } catch (err) {
    next(err);
  }
});


// POST /students/:id/unenroll
router.post('/:id/unenroll', async (req, res, next) => {
  try {
    const studentCourse = await StudentCourse.findOneAndDelete({
      student_id: req.params.id,
      course_id: req.body.course_id
    });
    if (!studentCourse) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
