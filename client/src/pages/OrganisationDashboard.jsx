/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  useParams
} from 'react-router-dom';
import { toast } from '@chakra-ui/react';
import AdminDashBoard from '../components/Organization/AdminDashboard';
import EmployeeDashBoard from '../components/Organization/EmployeeDasboard';
import SidebarWithHeader from '../components/SideBar/SideBar';
import { BACKEND_URL } from '../config/config';

export default function OrgansationDashboardPage() {
  const { orgId } = useParams();
  const url = `/organizations/${orgId}`;
  const token = localStorage.getItem('token');
  const [orgData, setOrgData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      await axios({
        method: 'post',
        url: `${BACKEND_URL}/org/getDashboardData`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({
          orgId
        })
      })
        .then((res) => {
          console.log(res.data);
          setOrgData(res.data);
          setIsAdmin(res.data.isAdmin);
        })
        .catch((err) => {
          console.log(err.response.data.error);
          toast({
            title: 'Error',
            description: err.response.data.error,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    };

    getDashboardData();
  }, []);

  return (
    <SidebarWithHeader isAdmin={isAdmin} url={url} orgId={orgId}>
      {
        isAdmin ? (
          <AdminDashBoard orgData={orgData} />
        ) : (
          <EmployeeDashBoard orgData={orgData} />
        )
      }
    </SidebarWithHeader>
  );
}
