/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  useToast,
  Text
} from '@chakra-ui/react';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import axios from 'axios';
import { BACKEND_URL } from '../../config/config';

export default function AddNewMember({ orgId }) {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleAddEmployee = async () => {
    if (!email.match(/@{1}/) || email.match(/^@|@$/)) {
      toast({
        title: 'Error',
        description: 'Invalid email',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    await axios({
      method: 'post',
      url: `${BACKEND_URL}/org/addMember`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        orgId,
        email
      })
    })
      .then((res) => {
        console.log(res.data.message);
        toast({
          title: 'Success',
          description: 'Successfully added employee',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <VStack spacing={8}>
      <Heading fontSize="3xl">Add New Employee</Heading>
      <FormControl>
        <FormLabel htmlFor="name">Email:</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <HiOutlineOfficeBuilding />
          </InputLeftElement>
          <Input
            id="name"
            placeholder="Enter the email of the employee"
            focusBorderColor="purple.200"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <Text fontSize="sm" textAlign="center">
        The employee email must be already registered on
        our application to add them to your organization.
      </Text>
      <Button
        type="submit"
        colorScheme="purple"
        bg="purple.300"
        variant="solid"
        w="full"
        onClick={handleAddEmployee}
      >
        Add Employee
      </Button>
    </VStack>
  );
}

AddNewMember.propTypes = {
  orgId: PropTypes.string.isRequired
};
