import React from 'react';
import {
  Route, Routes, Navigate
} from 'react-router-dom';

import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import FaceLogin from '../pages/FaceLogin';

export default function Routers() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/facelogin" element={<FaceLogin />} />
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}
