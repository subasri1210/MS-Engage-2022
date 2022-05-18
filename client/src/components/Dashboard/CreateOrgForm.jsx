/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Textarea,
  Box,
  useColorMode,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import axios from 'axios';

import { BACKEND_URL } from '../../config/config';
import './styles.css';

export default function CreateOrgForm() {
  const mode = useColorMode();
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [intime, setIntime] = useState({
    start: '',
    end: ''
  });
  const [outime, setOutime] = useState({
    start: '',
    end: ''
  });
  const toast = useToast();

  const handleCreateOrg = async () => {
    if (orgName.length === 0) {
      toast({
        description: 'Organisation name cannot be empty',
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true
      });
    } else if (orgDesc.length === 0) {
      toast({
        description: 'Organisation description cannot be empty',
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true
      });
    } else if (intime.start === '' || intime.end === ''
      || outime.start === '' || outime.end === ''
      || intime.start > intime.end || outime.start > outime.end
      || intime.start > outime.start || intime.end > outime.end
    ) {
      toast({
        description: 'Please provide a valid time range',
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true
      });
    }

    const token = localStorage.getItem('token');

    await axios({
      method: 'post',
      url: `${BACKEND_URL}/org/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify({
        name: orgName,
        description: orgDesc,
        inTime: intime,
        outTime: outime
      })
    })
      .then((res) => {
        console.log(res.data);
        toast({
          description: 'Organisation created successfully!',
          status: 'success',
          duration: 5000,
          position: 'top',
          isClosable: true
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Error',
          description: err.response.data.error,
          status: 'error',
          duration: 5000,
          position: 'top',
          isClosable: true
        });
      });
  };

  return (
    <VStack spacing={8}>
      <Heading fontSize="3xl">Create new Organization</Heading>
      <FormControl>
        <FormLabel htmlFor="name">Name:</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <HiOutlineOfficeBuilding />
          </InputLeftElement>
          <Input
            id="name"
            placeholder="Enter the name of the organization"
            focusBorderColor="purple.200"
            variant="filled"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="description">Description:</FormLabel>
        <InputGroup>
          <Textarea
            focusBorderColor="purple.200"
            placeholder="Enter the short description of your organisation"
            variant="filled"
            value={orgDesc}
            onChange={(e) => setOrgDesc(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <HStack spacing={10} align="start">
        <Box>
          <Text fontSize="md">Employee Intime:</Text>
          <Text fontSize="xs" textAlign="center">( start - end )</Text>
        </Box>
        <Box className={`input-container-${mode.colorMode}`}>
          <input
            type="time"
            value={intime.start}
            onChange={(e) => setIntime({ ...intime, start: e.target.value })}
          />
        </Box>
        <Box className={`input-container-${mode.colorMode}`}>
          <input
            type="time"
            value={intime.end}
            onChange={(e) => setIntime({ ...intime, end: e.target.value })}
          />
        </Box>
      </HStack>
      <HStack spacing={10} align="start">
        <Box>
          <Text fontSize="md">Employee Outime:</Text>
          <Text fontSize="xs" textAlign="center">( start - end )</Text>
        </Box>
        <Box className={`input-container-${mode.colorMode}`}>
          <input
            type="time"
            value={outime.start}
            onChange={(e) => setOutime({ ...outime, start: e.target.value })}
          />
        </Box>
        <Box className={`input-container-${mode.colorMode}`}>
          <input
            type="time"
            value={outime.end}
            onChange={(e) => setOutime({ ...outime, end: e.target.value })}
          />
        </Box>
      </HStack>
      <Text fontSize="xs" textAlign="center">
        Your Employees will be able to mark their attendance
        only within the intime and outime range you provide.
      </Text>
      <Button
        type="submit"
        colorScheme="brand"
        w="full"
        onClick={handleCreateOrg}
      >
        Create
      </Button>
    </VStack>
  );
}
