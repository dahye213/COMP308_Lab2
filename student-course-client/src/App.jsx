import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './App.css';
// Import components
import Home from './components/Home';
import AddStudent from './components/AddStudent';
import Login from './components/Login';
import AddCourse from './components/AddCourse';
import EditStudent from './components/EditStudent';
import ListCourses from './components/ListCourses';
import CourseHome from './components/CourseHome';
import StudentList from './components/StudentList';
// App component
function App() {
  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            React Client For GraphQL API
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/createStudent">
                Create Student
              </Nav.Link>
              <Nav.Link as={Link} to="/studentList">
                Student List
              </Nav.Link>
              <Nav.Link as={Link} to="/addCourse">
                Add Course
              </Nav.Link>
              <Nav.Link as={Link} to="/listCourses">
                List Courses
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="studentList" element={<StudentList />} />
          <Route path="createStudent" element={<AddStudent />} />
          <Route path = "editStudent/:id" element={<EditStudent />} />
          <Route path="addCourse" element={<AddCourse />} />
          <Route path="listCourses" element={<ListCourses />} />
          <Route path="coursehome" element={<CourseHome/>} />
        </Routes>
      </div>
    </Router>
  );
}
//
export default App;
