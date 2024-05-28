import React, { useState } from "react";
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

function Login({ checkToken }) {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ''
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      Swal.fire({
        text: "Please enter both email and password",
        icon: 'warning'
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        text: "Please enter a valid email address",
        icon: 'warning'
      });
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL}/auth/login`, loginData);

      if (response.status === 200) {
        console.log(response.data);
        const token = response.data.token;

        sessionStorage.setItem('Token', JSON.stringify(token));
        
        checkToken(token);

        Swal.fire({
          text: `${response.data.message}`,
          icon: "success"
        });

        setLoginData({ email: '', password: '' });
        navigate('/course');
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        text: "Login Failed",
        icon: 'error'
      });
    }
  };

  return (
    <Container fluid>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }} className=' bg-light'>
        <Container className='col-12 col-lg-5 col-xl-5 border border-2 p-3 rounded'>
          <h2 className=' text-center my-3'>Login Page</h2>

          <Form.Label htmlFor="basic-url">Enter Email Address</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              type="email"
              value={loginData.email}
            />
          </InputGroup>

          <Form.Label htmlFor="basic-url">Enter Password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              type="password"
              value={loginData.password}
            />
          </InputGroup>

          <Container className='text-center'>
            <Button onClick={handleLogin}>Login Account</Button>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

export default Login;
