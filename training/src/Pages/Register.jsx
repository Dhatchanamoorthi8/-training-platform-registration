import React, { useState } from 'react'
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2'
import axios from 'axios'
import config from '../config'
import { useNavigate  } from 'react-router-dom';

function Register() {


   const navigation = useNavigate()

    const [RegisterData, SetRegisterData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const handleregister = async () => {
        const { username, email, password } = RegisterData;

        if (!username) {
            Swal.fire({
                text: "Please Enter UserName",
                icon: 'warning'
            })
            return;
        }

        if (!email) {
            Swal.fire({
                text: "Please Enter Email Address",
                icon: 'warning'
            })
            return;
        }

        if (!validateEmail(email)) {
            Swal.fire({
                text: "Please Enter a Valid Email Address",
                icon: 'warning'
            })
            return;
        }

        if (!password) {
            Swal.fire({
                text: "Please Enter Password",
                icon: 'warning'
            })
            return;
        }

        try {
            const response = await axios.post(`${config.API_URL}/auth/register`, RegisterData)

            if (response.status === 200) {
                console.log(response);

                Swal.fire({
                    text: `${response.data.message}`,
                    icon: "success"
                });
               navigation('/login')
                SetRegisterData({ username: '', email: '', password: '' });
            }

        } catch (err) {
            console.log(err);
            Swal.fire({
                text: "Registration Failed",
                icon: 'error'
            });
        }
    }

    return (
        <Container fluid>
            <Container style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }} className=' bg-light'>
                <Container className='col-12 col-lg-5 col-xl-5 border border-2 p-3 rounded'>
                    <Form.Label htmlFor="basic-url">Enter User Name</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Username"
                            aria-label="Username"
                            type="text"
                            aria-describedby="basic-addon1"
                            onChange={(e) => SetRegisterData({ ...RegisterData, username: e.target.value })}
                            value={RegisterData.username}
                        />
                    </InputGroup>

                    <Form.Label htmlFor="basic-url">Enter Email Address</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            onChange={(e) => SetRegisterData({ ...RegisterData, email: e.target.value })}
                            type="email"
                            value={RegisterData.email}
                        />
                    </InputGroup>

                    <Form.Label htmlFor="basic-url">Enter Password</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            onChange={(e) => SetRegisterData({ ...RegisterData, password: e.target.value })}
                            type="password"
                            value={RegisterData.password}
                        />
                    </InputGroup>

                    <Container className='text-center'>
                        <Button onClick={handleregister}>Register Account</Button>
                    </Container>
                </Container>
            </Container>
        </Container>
    )
}

export default Register;
