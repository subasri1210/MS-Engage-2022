/* eslint-disable no-nested-ternary */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  useParams
} from 'react-router-dom';
import { toast, Center, Spinner } from '@chakra-ui/react';
import SidebarWithHeader from '../components/SideBar/SideBar';
import { BACKEND_URL } from '../config/config';
import AdminAnalytics from '../components/OrganisationAnalytic/AdminAnalytics';
import EmployeeAnalytics from '../components/OrganisationAnalytic/EmployeeAnalytics';

export default function OrganisationAnalytics() {
  const { orgId } = useParams();
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [dateValue, setDateValue] = useState(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [yearValue, setYearValue] = useState(new Date().getFullYear());
  const url = `/organizations/${orgId}`;

  const handleChangeDateValue = (date) => {
    console.log(date);
    setDateValue(date);
  };

  const handleMonthValue = (month) => {
    setMonthValue(month);
  };

  const handleYearValue = (year) => {
    setYearValue(year);
  };

  useEffect(() => {
    setIsLoading(true);
    const getDashboardData = async () => {
      await axios({
        method: 'post',
        url: `${BACKEND_URL}/org/getAnalytics`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: JSON.stringify({
          orgId,
          date: dateValue,
          month: monthValue,
          year: yearValue
        })
      })
        .then((res) => {
          console.log(res.data);
          setIsAdmin(res.data.isAdmin);
          setAnalytics(res.data);
          setIsLoading(false);
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
  }, [dateValue, monthValue, yearValue]);

  return (
    <SidebarWithHeader isAdmin={isAdmin} url={url}>
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
            <AdminAnalytics
              totalEmployees={analytics.totalEmployees}
              dateValue={dateValue}
              handleChangeDateValue={handleChangeDateValue}
              dateAnalytics={analytics.dateAnalytics}
              monthValue={monthValue}
              yearValue={yearValue}
              handleMonthValue={handleMonthValue}
              handleYearValue={handleYearValue}
              monthAnalytics={analytics.monthAnalytics}
            />
          ) : (
            <EmployeeAnalytics
              monthValue={monthValue}
              yearValue={yearValue}
              handleMonthValue={handleMonthValue}
              handleYearValue={handleYearValue}
              monthAnalytics={analytics.monthAnalytics}
            />
          )
        )
      }
    </SidebarWithHeader>
  );
}
