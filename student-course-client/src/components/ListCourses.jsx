import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import EditCourse from './EditCourse';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      courseCode
      courseName
      section
      semester
    }
  }
`;
const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

const ListCourses = () => {
    const { loading, error, data, refetch } = useQuery(GET_COURSES, { errorPolicy: 'all' });
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRowClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleDelete = async (courseId, e) => {
    e.stopPropagation(); 
    try {
      await deleteCourse({ variables: { id: courseId } });
      refetch(); 
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div>
      <h2>List of Courses</h2>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.courses.map((course, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(course.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.section}</td>
              <td>{course.semester}</td>
              <td>
                <button onClick={(e) => handleDelete(course.id, e)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCourse && (
         <div style={{ marginTop: '20px' }}> 
            <EditCourse
            courseId={selectedCourse}
            existingContent={data.courses.find((course) => course.id === selectedCourse)}
            onClose={() => setSelectedCourse(null)}
            />
        </div>
      )}

        <div style={{ marginTop: '20px' }}> 
            <button onClick={() => refetch()}>Refetch</button>
        </div>
    </div>
  );
};

export default ListCourses;
