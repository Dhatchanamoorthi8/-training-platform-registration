import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Course from './Pages/Course';
import Students from './Pages/Students';



function App() {

  const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('Token')))

  useEffect(() => {
    const localData = () => {
      const storedToken = JSON.parse(sessionStorage.getItem('Token'))
      setToken(storedToken);
    }

    localData()
  }, []);


  // const handleCheckToken = (newToken) => {
  //   setToken(newToken);
  // };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login checkToken={setToken} />} />

        <Route
          path="/course"
          element={
            token !== '' ? (
              <Course token={token} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        <Route
          path="/students"
          element={
            token !== '' ? (
              <Students token={token} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />



      </Routes>
    </Router>
  );
}

export default App;
