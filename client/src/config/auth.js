/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { BACKEND_URL } from './config';

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('_id');
};

export const authCheck = async () => {
  console.log('inside auth check');
  let data = null; let
    isAuthenticated = false;
  console.log('token', localStorage.getItem('token'));
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios({
        method: 'get',
        url: `${BACKEND_URL}/checkToken`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        console.log('response', response);
        data = response.data;
        isAuthenticated = true;
      });
    } catch (err) {
      console.log(err);
    }
  }
  const response = {
    data,
    isAuthenticated
  };
  console.log('Response', response);
  return response;
};
