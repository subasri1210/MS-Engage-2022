import React from 'react';
import {
  Route, Routes, Navigate, BrowserRouter
} from 'react-router-dom';

import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import FaceLogin from '../pages/FaceLogin';
import Dashboard from '../pages/DashBoard';
import OrgansationDashboardPage from '../pages/OrganisationDashboard';
import SidebarWithHeader from '../components/SideBar/SideBar';

export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/facelogin" element={<FaceLogin />} />
        <Route path="/organizations" element={<Dashboard />} />
        <Route path="/organizations/:orgId" element={<OrgansationDashboardPage />} />
        {/* <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} /> */}
        <Route path="/side" element={<SidebarWithHeader />} />
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
