// AddUser component
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
//
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
//
// AddUser mutation
const ADD_STUDENT = gql`
  mutation AddStudent($studentNumber:String!,$firstName: String!, $lastName: String!, $address: String!, 
                    $city: String!, $phoneNumber: String!, $email: String!, $password:String!, $program: String!) {
    createStudent(studentNumber:$studentNumber, firstName: $firstName, lastName: $lastName, address: $address, city: $city
        , phoneNumber: $phoneNumber, email: $email, password:$password, program: $program ) {
            studentNumber
            firstName
            lastName
            address
            city
            phoneNumber
            email
            program  
    }
  }
`;
// AddUser component
const AddStudent = () => {
  let navigate = useNavigate()
  const[studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [program, setProgram] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  // AddUser mutation
  const [createStudent] = useMutation(ADD_STUDENT);
  //
  const saveStudent = (e) => {
    setShowLoading(true);
    e.preventDefault();
    // Add user
    createStudent({ variables: { studentNumber,firstName,lastName, address, city, phoneNumber,email, password,program } });
    // Clear input fields
    setStudentNumber('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setCity('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setProgram('');
    setShowLoading(false);
    navigate('/studentList')  // navigate to student list page
  };
  //

  // AddUser component UI
  return (
    <div>
    {showLoading && 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> 
      } 
      <h2>Create Student</h2>
      <Form onSubmit={saveStudent}>
        <Form.Group>
            <Form.Label>Student Number</Form.Label>
            <Form.Control type="text" name="studentNumber" id="studentNumber" placeholder="Enter student Number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" id="address" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" id="city" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phoneNumber" id="phoneNumber" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" id="email" rows="3" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Program</Form.Label>
            <Form.Control type="text" name="program" id="program" placeholder="Enter your program" value={program} onChange={(e) => setProgram(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
            Save
        </Button>

      </Form>
    </div>

  );
};
//
export default AddStudent;
