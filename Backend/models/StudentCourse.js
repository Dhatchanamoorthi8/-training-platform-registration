
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentCourseSchema = new Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolled_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentCourse', StudentCourseSchema);
