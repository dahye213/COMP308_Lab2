// Import resolvers for each operation
const { updateStudent } = require('../resolvers/student.server.resolver');
const graphql = require('graphql');
// user-article-schema.js
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
  } = graphql;
  
  const StudentModel = require('../models/student.server.model'); // Import your User model
  const CourseModel = require('../models/course.server.model'); // Import your Article model
  
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = "some_secret_key"; // generate this elsewhere
  const jwtExpirySeconds = 300;
  
// Create a GraphQL Object Type for Student model
// The fields object is a required property of a GraphQLObjectType 
// and it defines the different fields or query/mutations that are available
// in this type.
  const StudentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
      return {
        id: {
          type: GraphQLID // Unique identifier for the student (typically corresponds to MongoDB _id)
        },
        studentNumber: {
          type: GraphQLString
        },
        firstName:{
          type:GraphQLString
        },
        lastName:{
          type:GraphQLString
        },
        address:{
          type:GraphQLString
        },
        city:{
          type:GraphQLString
        },
        phoneNumber:{
          type:GraphQLString
        },
        email: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        program:{
          type:GraphQLString
        },
        // courseId:{
        //   type: GraphQLID
        // }
        courses: {
          type: new GraphQLList(CourseType),
          resolve: async (student) => {
            await student.populate('courseId').execPopulate();
            return student.courseId;
          }
        }
      };
    },
  });
  
  // Create a GraphQL Object Type for Course model
  const CourseType = new GraphQLObjectType({
    name: "Course",
    fields: ()=>({
        id: {
          type: GraphQLID,
          resolve: (course) => course._id,
        },
        courseCode: {type:GraphQLString},
        courseName: {type:GraphQLString},
        section: {type:GraphQLString},
        semester: {type:GraphQLString}
    })
});

  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
        students: {
          type: new GraphQLList(StudentType),

          resolve: function () {
            const students = StudentModel.find().exec()
            if (!students) {
              throw new Error('Error')
            }
            return students
          }
        },
        student: {
          type: StudentType,
          args: {
            id: {
              name: 'id',
              type: GraphQLString
            }
          },
          resolve: async function (root, params) {
            console.log('Executing student resolver with params:', params);
            try {
              const studentInfo = await StudentModel.findById(params.id).exec();
              console.log('Student info:', studentInfo);
  
              if (!studentInfo) {
                console.error('Student not found for id:', params.id);
                throw new Error('Error');
              }
  
              return studentInfo;
            } catch (error) {
              console.error('Error fetching user:', error);
              throw new Error('Failed to fetch student');
            }
          }
        },
        // check if user is logged in
        isLoggedIn: {
          type: GraphQLBoolean,  // Change the type to Boolean
          args: {
            email: {
              name: 'email',
              type: GraphQLString,
            },
          },
          resolve: function (root, params, context) {
            const token = context.req.cookies.token;
  
            // If the cookie is not set, return false
            if (!token) {
              return false;
            }
  
            try {
              // Try to verify the token
              jwt.verify(token, JWT_SECRET);
              return true;  // Token is valid, user is logged in
            } catch (e) {
              // If verification fails, return false
              return false;
            }
          },
        },
        // 
        courses: {
          type: new GraphQLList(CourseType),
          resolve: function () {
            const courses = CourseModel.find().exec()
            if (!courses) {
              throw new Error('Error')
            } 
            return courses;
          },
        },

        course: {
          type: CourseType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID),
            },
          },
          resolve: async function (root, { id }) {
            try {
              const course = await CourseModel.findById(id).exec();
  
              if (!course) {
                throw new Error('Course not found');
              }
  
              return course;
            } catch (error) {
              console.error('Error fetching course:', error);
              throw new Error('Failed to fetch course');
            }
          },
        },
        


      };
    },
  });
  // Create a graphql Object type for Mutation
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        createStudent: {
          type: StudentType,
          args: {
            studentNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName:{
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName:{
              type: new GraphQLNonNull(GraphQLString)
            },
            address:{
              type: new GraphQLNonNull(GraphQLString)
            },
            city:{
              type: new GraphQLNonNull(GraphQLString)
            },
            phoneNumber:{
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
            program:{
              type: new GraphQLNonNull(GraphQLString)
            },
          },
          resolve: function (root, params, context) {
            const studentModel = new StudentModel(params);
            const newStudent = studentModel.save();
            if (!newStudent) {
              throw new Error('Error');
            }
            return newStudent
          }
        },

        updateStudent: {
          type: StudentType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            studentNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName:{
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName:{
              type: new GraphQLNonNull(GraphQLString)
            },
            address:{
              type: new GraphQLNonNull(GraphQLString)
            },
            city:{
              type: new GraphQLNonNull(GraphQLString)
            },
            phoneNumber:{
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            program:{
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          // Add the resolver for updateUser
          resolve: updateStudent
        },
        loginStudent: {
          type: GraphQLBoolean,  // Change the type to Boolean
          args: {
            email: {
              name: 'email',
              type: GraphQLString,
            },
            password: {
              name: 'password',
              type: GraphQLString,
            },
          },
          resolve: async function (root, params, context) {
            console.log('Executing loginUser resolver with params:', params);

            const studentInfo = await StudentModel.findOne({ email: params.email }).exec();
            console.log('Student info:', studentInfo);
            if (!studentInfo) {
              console.error('Student not found for email:', params.email);
              return false;  // Authentication failed
            }
            console.log('email: ', studentInfo.email)
            console.log('entered pass: ',params.password)
            console.log('hash: ', studentInfo.password)
             // check if the password is correct
            const isValidPassword = await bcrypt.compare(params.password.trim(), studentInfo.password);
            console.log('bcrypt.compare Result: ', isValidPassword);

            if (!isValidPassword) {
              console.error('Invalid password');
              console.log('Entered Password:', params.password);
              console.log('Stored Password:', studentInfo.password);
              return false;  // Authentication failed
            }
  
            try {
              const token = jwt.sign(
                { _id: studentInfo._id, email: studentInfo.email },
                JWT_SECRET,
                { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
              );
            
              console.log('Generated token:', token);
            
              context.res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });
              return true;  // Authentication successful
            } catch (error) {
              console.error('Error generating token:', error);
              return false; // Authentication failed
            }
          },
        },

        logOut: {
            type: GraphQLString,
            resolve: (parent, args, context) => {
              context.res.clearCookie('token');
              return 'Logged out successfully!';
            },
        },
        addCourse: {
          type: CourseType,
          args: {
            courseCode: {
              type: new GraphQLNonNull(GraphQLString),
            },
            courseName: {
              type: new GraphQLNonNull(GraphQLString),
            },
            section: {
              type: new GraphQLNonNull(GraphQLString),
            },
            semester: {
              type: new GraphQLNonNull(GraphQLString),
            },
          },
          resolve: async function (root, { courseCode, courseName, section, semester }, context) {
            // Check if the user is logged in
            const token = context.req.cookies.token;
        
            if (!token) {
              throw new Error('Student not authenticated');
            }
        
            try {
              // Verify the token to get the user ID
              const decodedToken = jwt.verify(token, JWT_SECRET);
              const students = decodedToken._id;
        
              // Continue with adding the course, including the students
              const courseModel = new CourseModel({ courseCode, courseName, section, semester });
              const savedCourse = await courseModel.save();
        
              return savedCourse;
            } catch (error) {
              console.error('Error adding course:', error);
              throw new Error('Failed to add course');
            }
          },
        },

        editCourse: {
          type: CourseType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID),
            },
            courseCode: {
              type: new GraphQLNonNull(GraphQLString),
            },
            courseName: {
              type: new GraphQLNonNull(GraphQLString),
            },
            section: {
              type: new GraphQLNonNull(GraphQLString),
            },
            semester: {
              type: new GraphQLNonNull(GraphQLString),
            },
          },
          resolve: async function (root, params, context) {
            const token = context.req.cookies.token;
            if (!token) {
              return 'not-auth';
            }
  
            try {
              // Get the user ID from the token
              const { _id: studentId } = jwt.verify(token, JWT_SECRET);
              
              // Find the course by ID
              const course = await CourseModel.findById(params.id).exec();
  
              // Update the course content
              const update = {
                courseCode: params.courseCode,
                courseName: params.courseName,
                section: params.section,
                semester: params.semester,
              };
              const updatedCourse = await CourseModel.findByIdAndUpdate(params.id, update, { new: true }).exec();
        
              return updatedCourse;
            } catch (error) {
              console.error('Error editing course:', error);
              // Handle the error, e.g., show an error message to the user.
              throw new Error('Failed to edit course');
            }
          },
        },
        deleteCourse: {
          type: GraphQLString, 
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID),
            },
          },
          resolve: async (root, { id }, context) => {
        
            const token = context.req.cookies.token;
            if (!token) {
              throw new Error('Authentication required');
            }
            try {
              const deletedCourse = await CourseModel.findByIdAndDelete(id);
              if (!deletedCourse) {
                throw new Error('Course not found');
              }
              return deletedCourse.id; // 삭제된 Course의 ID 반환
            } catch (error) {
              console.error('Error deleting course:', error);
              throw new Error('Failed to delete course');
            }
          },
        },
      };
    },
  });
  
  module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });