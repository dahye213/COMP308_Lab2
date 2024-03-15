//article.server.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName:{
    type:String,
    required:true
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  }
});

const CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel;
