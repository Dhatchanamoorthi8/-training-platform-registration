import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';

import Modal from 'react-bootstrap/Modal';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

import Nav from 'react-bootstrap/Nav';

import { Link, useNavigate } from 'react-router-dom';


function Students({ token }) {

    const navigate = useNavigate()

    const [rowData, setRowData] = useState([]);

    const [show, setShow] = useState(false);

    const [StudentRegisterData, SetStudentRegisterData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })


    const [StudentUpdateData, SetStudentUpdateData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        id: null
    })


    const [ShowUpdatemodal, setShowUpdatemodal] = useState(false);

    const handleClose = () => {
        setShow(false);
        setShowUpdatemodal(false)
    }
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleregisterStudent = async () => {

        if (StudentRegisterData.first_name === '') {
            Swal.fire({
                text: 'Please Enter Course Name',
                icon: 'warning'
            })
            return
        }

        if (StudentRegisterData.last_name === '') {
            Swal.fire({
                text: 'Please Enter Last Name',
                icon: 'warning'
            })
            return
        }


        if (StudentRegisterData.email === '') {
            Swal.fire({
                text: 'Please Enter Email',
                icon: 'warning'
            })
            return
        }


        if (!validateEmail(StudentRegisterData.email)) {
            Swal.fire({
                text: "Please enter a valid email address",
                icon: 'warning'
            });
            return;
        }

        if (StudentRegisterData.password === '') {
            Swal.fire({
                text: 'Please Enter Password',
                icon: 'warning'
            })
            return
        }

        try {

            const response = await axios.post(
                `${config.API_URL}/students/`,
                StudentRegisterData,
                {
                    headers: {
                        'x-auth-token': token,
                    }
                }
            );

            console.log(response);

            if (response.status === 200) {
                handleClose();
                getData()
                SetStudentRegisterData({ ...StudentRegisterData, first_name: '', last_name: '', email: '', password: '' })
                Swal.fire({
                    text: `Student Registered Successfully`,
                    icon: 'success'
                });
            }


        } catch (err) {
            console.log(err);
            Swal.fire({
                text: `${err.response.data.error}`,
                icon: 'error'
            })
        }

    }

    const column = [
        {
            field: 'first_name',
            headerName: 'First Name',
            align: 'center',
            headerAlign: 'center',

        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100

        },

        {
            field: 'email',
            headerName: 'Email',
            align: 'center',
            headerAlign: 'center',
            minWidth: 300

        },

        {
            field: 'password',
            headerName: 'Password',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100

        },
        {
            field: 'Edit',
            headerName: 'Edit',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            cellRenderer: (params) => (
                <Button onClick={() => handleupdatestudent(params.data._id)} className=' text-center'>Edit</Button >
            )
        },
        {
            field: 'Delete',
            headerName: 'Delete',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            cellRenderer: (params) => (
                <Button variant="danger" onClick={() => handleDeletestudents(params.data._id)} className=' text-center'>Delete</Button >
            )
        }
    ]



    const handleupdatestudent = async (id) => {

        try {
            const response = await axios.get(`${config.API_URL}/students/${id}`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.data) {
                setShowUpdatemodal(true)
                const { first_name, last_name, email, password, _id } = response.data
                SetStudentUpdateData({ ...StudentUpdateData, first_name: first_name, last_name: last_name, email: email, password: password, id: _id })
            }
        } catch (err) {
            setShowUpdatemodal(false)
            alert('Somtheing Went wrong ')
        }

    }


    const handleupdate = async () => {
        try {

            const response = await axios.put(`${config.API_URL}/students/${StudentUpdateData.id}`, StudentUpdateData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.status === 200) {
                getData()
                setShowUpdatemodal(false)
                Swal.fire({
                    text: 'Updated SuccessFully',
                    icon: 'success'
                })
            }

        } catch (err) {
            console.log(err);
        }

    }

    const handleDeletestudents = async (id) => {

        try {
            const response = await axios.delete(`${config.API_URL}/students/${id}`, {
                headers: {
                    'x-auth-token': token,
                },
            });
            if (response.status === 200) {
                getData()
                Swal.fire({
                    text: `${response.data.message}SuccessFully`,
                    icon: 'success'
                })
            }

        } catch (err) {
            console.log(err);
        }

    }


    const handlelogout = async () => {
        try {
            sessionStorage.clear('Token')
            navigate('/login')

        } catch (err) {
            console.log(err);
        }

    }


    const getData = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/students/`, {
                headers: {
                    'x-auth-token': token,
                },
            });
            setRowData(response.data);

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        getData();
    }, []);


    return (
        <>
            <Container>
                <Nav variant="tabs" defaultActiveKey="/students">
                    <Nav.Item>

                        <Nav.Link eventKey="link-1" >
                            <Link to={"/course"} className=' nav-link'>Course</Link>
                        </Nav.Link>

                    </Nav.Item>
                    <Nav.Item>

                        <Nav.Link eventKey="link-1">
                            <Link to={"/students"} className='nav-link'>Student</Link>
                        </Nav.Link>

                    </Nav.Item>
                </Nav>
            </Container>




            <Container className='text-end m-2 p-2 d-flex justify-content-end gap-2'>
                <Button variant="primary" onClick={() => setShow(true)} className=' d-flex gap-2'> New <IoIosAddCircleOutline style={{ fontSize: "18px", marginTop: "4px" }} /></Button>
                <Button variant="danger" onClick={() => handlelogout()} className=' d-flex gap-2'>Logout <IoExitOutline style={{ fontSize: "18px", marginTop: "4px" }} /></Button>
            </Container>



            <Container className='ag-theme-quartz my-5' style={{ height: '400px', width: '90%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={column}
                    getRowHeight={() => 50}
                />
            </Container>



            {/* create modal */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Student Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Container>
                        <Form.Label htmlFor="basic-url">Enter Student FirstName</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="FirstName"
                                aria-label="FirstName"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentRegisterData({ ...StudentRegisterData, first_name: e.target.value.trim() })}
                                value={StudentRegisterData.first_name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Student LastName</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="LastName"
                                aria-label="LastName"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentRegisterData({ ...StudentRegisterData, last_name: e.target.value.trim() })}
                                value={StudentRegisterData.last_name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Student Email</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Email"
                                aria-label="Email"
                                type="email"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentRegisterData({ ...StudentRegisterData, email: e.target.value.trim() })}
                                value={StudentRegisterData.email}
                            />
                        </InputGroup>

                        <Form.Label htmlFor="basic-url">Enter Student Password</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Password"
                                aria-label="Password"
                                type="password"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentRegisterData({ ...StudentRegisterData, password: e.target.value.trim() })}
                                value={StudentRegisterData.password}
                            />
                        </InputGroup>

                    </Container>

                </Modal.Body>
                <Modal.Footer>

                    <Container className=' d-flex justify-content-between'>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleregisterStudent}>
                            Register Student
                        </Button>
                    </Container>

                </Modal.Footer>
            </Modal>





            {/* update modal */}

            <Modal show={ShowUpdatemodal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Container>
                        <Form.Label htmlFor="basic-url">Enter Student FirstName</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="FirstName"
                                aria-label="FirstName"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentUpdateData({ ...StudentUpdateData, first_name: e.target.value.trim() })}
                                value={StudentUpdateData.first_name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Student LastName</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="LastName"
                                aria-label="LastName"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentUpdateData({ ...StudentUpdateData, last_name: e.target.value.trim() })}
                                value={StudentUpdateData.last_name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Student Email</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Email"
                                aria-label="Email"
                                type="email"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentUpdateData({ ...StudentUpdateData, email: e.target.value.trim() })}
                                value={StudentUpdateData.email}
                            />
                        </InputGroup>

                        <Form.Label htmlFor="basic-url">Enter Student Password</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Password"
                                aria-label="Password"
                                type="password"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetStudentUpdateData({ ...StudentUpdateData, password: e.target.value.trim() })}
                                value={StudentUpdateData.password}
                            />
                        </InputGroup>

                    </Container>

                </Modal.Body>
                <Modal.Footer>

                    <Container className=' d-flex justify-content-between'>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleupdate}>
                            Save Data
                        </Button>
                    </Container>

                </Modal.Footer>
            </Modal>




        </>
    )
}

export default Students
