/* eslint-disable no-nested-ternary */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  useParams,
  useNavigate
} from 'react-router-dom';
import { useToast, Spinner, Center } from '@chakra-ui/react';
import SidebarWithHeader from '../components/SideBar/SideBar';
import { BACKEND_URL } from '../config/config';
import { AdminMemberView } from '../components/OrganisationMembers/AdminMemberView';
import { EmployeeMemberView } from '../components/OrganisationMembers/EmployeeMemberView';

export default function OrgansationMembersPage() {
  const { orgId } = useParams();
  const url = `/organizations/${orgId}`;
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminsData, setAdminsData] = useState(null);
  const [membersData, setMembersData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getMemberData = async () => {
      await axios({
        method: 'post',
        url: `${BACKEND_URL}/org/getAllMembers`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: JSON.stringify({
          orgId
        })
      })
        .then((res) => {
          console.log(res.data);
          setIsAdmin(res.data.isAdmin);
          setAdminsData(res.data.adminsData);
          setMembersData(res.data.membersData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.response.data.error);
          if (err.response.status === 401) {
            navigate('/login');
          }
          if (err.response.status === 402) {
            navigate('/organizations');
          }
          const id = 1;
          if (!toast.isActive(id)) {
            toast({
              id: 1,
              title: 'Error',
              description: err.response.data.error,
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          }
        });
    };

    getMemberData();
  }, []);

  return (
    <SidebarWithHeader isAdmin={isAdmin} url={url} orgId={orgId}>
      {
        isLoading ? (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
            />
          </Center>
        ) : (
          isAdmin ? (
            <AdminMemberView
              admins={adminsData}
              members={membersData}
            />
          ) : (
            <EmployeeMemberView
              admins={adminsData}
              members={membersData}
            />
          )
        )
      }
    </SidebarWithHeader>
  );
}
