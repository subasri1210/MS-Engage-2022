/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  useParams
} from 'react-router-dom';
import { toast } from '@chakra-ui/react';
import DashBoard from '../components/Organization/Dashboard';
import { BACKEND_URL } from '../config/config';

export default function OrgansationDashboardPage() {
  const { orgId } = useParams();
  const token = localStorage.getItem('token');
  const [orgData, setOrgData] = useState(null);

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
    <DashBoard orgData={orgData} />
  );
}
