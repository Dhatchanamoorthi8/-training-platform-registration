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

function Course({ token }) {

    const navigate = useNavigate()

    const [CourseRegisterData, SetCourseRegisterData] = useState({
        name: '',
        description: '',
    })

    const [CourseUpdateData, SetCourseUpdateData] = useState({
        name: '',
        description: '',
        id: null
    })


    const [rowData, setRowData] = useState([]);

    const [show, setShow] = useState(false);

    const [ShowUpdatemodal, setShowUpdatemodal] = useState(false);

    const handleClose = () => {
        setShow(false);
        setShowUpdatemodal(false)
    }


    const handlecreateNewCourse = async () => {

        if (CourseRegisterData.name === '') {
            Swal.fire({
                text: 'Please Enter Course Name',
                icon: 'warning'
            })
            return
        }

        if (CourseRegisterData.description === '') {
            Swal.fire({
                text: 'Please Enter Course description',
                icon: 'warning'
            })
            return
        }

        try {

            const response = await axios.post(
                `${config.API_URL}/courses/`,
                CourseRegisterData,
                {
                    headers: {
                        'x-auth-token': token,
                    }
                }
            );

            console.log(response.data);
            Swal.fire({
                text: `Course Created Successfully`,
                icon: 'success'
            });

            handleClose();
            getData()

        } catch (err) {
            console.log(err);
        }

    }




    const column = [
        {
            field: 'name',
            headerName: 'Course Name',
            align: 'center',
            headerAlign: 'center',

        },
        {
            field: 'description',
            headerName: 'Course Description',
            align: 'center',
            headerAlign: 'center',

        },

        {
            field: 'Edit',
            headerName: 'Edit',
            align: 'center',
            headerAlign: 'center',
            cellRenderer: (params) => (
                <Button onClick={() => handleupdatecourse(params.data._id)} className=' text-center'>Edit</Button >
            )
        },
        {
            field: 'Delete',
            headerName: 'Delete',
            align: 'center',
            headerAlign: 'center',

            cellRenderer: (params) => (
                <Button variant="danger" onClick={() => handleDeletecourse(params.data._id)} className=' text-center'>Delete</Button >
            )
        }
    ]


    const handleupdatecourse = async (id) => {

        try {
            const response = await axios.get(`${config.API_URL}/courses/${id}`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.data) {
                setShowUpdatemodal(true)
                console.log(response);
                const { description, name, _id } = response.data
                console.log(description, name, _id);
                SetCourseUpdateData({ ...CourseUpdateData, description: description, name: name, id: _id })
            }
        } catch (err) {
            setShowUpdatemodal(false)
            alert('Somtheing Went wrong ')
        }

    }


    const handleupdatedata = async () => {
        try {

            const response = await axios.put(`${config.API_URL}/courses/${CourseUpdateData.id}`, CourseUpdateData, {
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


    const handleDeletecourse = async (id) => {
        try {
            const response = await axios.delete(`${config.API_URL}/courses/${id}`, {
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




    const getData = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/courses/`, {
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



    const handlelogout = async () => {
        try {
            sessionStorage.clear('Token')
            navigate('/login')

        } catch (err) {
            console.log(err);
        }

    }



    useEffect(() => {
        getData();
    }, []);

    return (

        <>



            <Container>

                <Nav variant="tabs" defaultActiveKey="/course">
                    <Nav.Item className=' bg-info-subtle'>

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




            <Container className='ag-theme-quartz my-5' style={{ height: '500px', width: '60%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={column}
                    getRowHeight={() => 50}
                />
            </Container>



            {/* create modal */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Course Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Container>
                        <Form.Label htmlFor="basic-url">Enter Course Name</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Course Name"
                                aria-label="Username"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetCourseRegisterData({ ...CourseRegisterData, name: e.target.value.trim() })}
                                value={CourseRegisterData.name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Course Description</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Description"
                                aria-label="Description"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetCourseRegisterData({ ...CourseRegisterData, description: e.target.value.trim() })}
                                value={CourseRegisterData.description}
                            />
                        </InputGroup>

                    </Container>

                </Modal.Body>
                <Modal.Footer>

                    <Container className=' d-flex justify-content-between'>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handlecreateNewCourse}>
                            Create Course
                        </Button>
                    </Container>

                </Modal.Footer>
            </Modal>


            {/* Update modal */}
            <Modal show={ShowUpdatemodal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Course Update</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form.Label htmlFor="basic-url">Enter Course Name</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Course Name"
                                aria-label="Username"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetCourseUpdateData({ ...CourseUpdateData, name: e.target.value.trim() })}
                                value={CourseUpdateData.name}
                            />
                        </InputGroup>


                        <Form.Label htmlFor="basic-url">Enter Course Description</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Description"
                                aria-label="Description"
                                type="text"
                                aria-describedby="basic-addon1"
                                onChange={(e) => SetCourseUpdateData({ ...CourseUpdateData, description: e.target.value.trim() })}
                                value={CourseUpdateData.description}
                            />
                        </InputGroup>

                    </Container>

                </Modal.Body>
                <Modal.Footer>

                    <Container className=' d-flex justify-content-between'>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleupdatedata}>
                            Save Data
                        </Button>
                    </Container>

                </Modal.Footer>
            </Modal>

        </>
    );
}

export default Course;
