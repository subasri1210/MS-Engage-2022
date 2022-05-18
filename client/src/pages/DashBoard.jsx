import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Organization from '../components/Dashboard';
import { authCheck } from '../config/auth';
import { BACKEND_URL } from '../config/config';

export default function DashBoard() {
  const [userData, setUserData] = useState(null);
  const [userOrgs, setUserOrgs] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkUserAndGetUserOrgs = async () => {
      const response = await authCheck();
      if (!response.isAuthenticated) {
        toast({
          description: 'Please log in to continue!',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        navigate('/login');
        return;
      }
      setUserData(response.data);
      await axios({
        method: 'get',
        url: `${BACKEND_URL}/org/userOrgs`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          console.log(res.data.data);
          setUserOrgs(res.data.data);
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
    checkUserAndGetUserOrgs();
  }, []);

  return (
    <Organization userData={userData} userOrgs={userOrgs} />
  );
}
