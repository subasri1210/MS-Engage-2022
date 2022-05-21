/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormHelperText,
  Box,
  useBoolean,
  useToast
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff
} from 'react-icons/fi';

import SignUpSvg from '../../assets/signuppage.svg';
import FaceRegister from './FaceRegister';
import { BACKEND_URL } from '../../config/config';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [isPasswordInvalid, setPasswordInvalid] = useState(false);
  const [isNameInvalid, setNameInvalid] = useState(false);
  const [showFaceRegister, setShowFaceRegister] = useState(false);
  const [isLoading, setIsLoading] = useBoolean();
  const toast = useToast();
  const [isVisible, setVisible] = useBoolean();
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleImageChange = (data) => setImage(data);
  const handleLoading = () => { setIsLoading.toggle(); };

  const handleNextClick = () => {
    if (!email.match(/@{1}/) || email.match(/^@|@$/)) {
      setEmailInvalid(true);
      return;
    }
    setEmailInvalid(false);
    if (name.length < 1) {
      setNameInvalid(true);
      return;
    }
    setNameInvalid(false);
    if (password.length < 8) {
      setPasswordInvalid(true);
      return;
    }
    setPasswordInvalid(false);
    setShowFaceRegister(true);
  };

  const handleRegister = async () => {
    handleLoading();
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    form.append('name', name);
    form.append('image', image);
    await axios({
      method: 'post',
      url: `${BACKEND_URL}/signup`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
      .then((res) => {
        handleLoading();
        console.log(res.data);
        toast({
          title: 'Success',
          description: 'Successfully registered. Please login to continue.',
          status: 'success',
          duration: 5000,
          position: 'top',
          isClosable: true
        });
        navigate('/login');
      })
      .catch((err) => {
        handleLoading();
        console.log(err.response.data.error);
        toast({
          title: 'Error',
          description: err.response.data.error,
          status: 'error',
          duration: 5000,
          position: 'top',
          isClosable: true
        });
        setShowFaceRegister(false);
      });
  };

  return (
    <Box>
      {!showFaceRegister ? (
        <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>

          <Flex p={8} flex={1} align="center" justify="center">
            <Stack spacing={10} w="full" maxW="md">
              <Heading fontSize="2xl">Sign up</Heading>

              <FormControl id="email" isInvalid={isEmailInvalid} isRequired>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FiMail />} />
                  <Input
                    value={email}
                    onChange={handleEmailChange}
                    focusBorderColor="purple.300"
                    type="email"
                  />
                </InputGroup>
                {isEmailInvalid ? (
                  <FormHelperText>
                    Please enter a valid email address
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>

              <FormControl id="name" isInvalid={isNameInvalid} isRequired>
                <FormLabel>Name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FiUser />} />
                  <Input
                    value={name}
                    onChange={handleNameChange}
                    focusBorderColor="purple.300"
                    type="text"
                  />
                </InputGroup>
                {isNameInvalid ? (
                  <FormHelperText>Name should not be empty.</FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>

              <FormControl id="password" isInvalid={isPasswordInvalid} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FiLock />} />
                  <Input
                    value={password}
                    onChange={handlePasswordChange}
                    focusBorderColor="purple.300"
                    type={isVisible ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={setVisible.toggle}>
                    {isVisible ? <FiEye /> : <FiEyeOff />}
                  </InputRightElement>
                </InputGroup>
                {isPasswordInvalid ? (
                  <FormHelperText>
                    Password should be at least 8 characters long.
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>

              <Stack spacing={4}>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="purple"
                  bg="purple.300"
                  variant="solid"
                  onClick={handleNextClick}
                >
                  Next
                </Button>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align="center"
                  justify="center"
                >
                  <Link href="/login" color="purple.500">
                    Already have an account? Log in
                  </Link>
                </Stack>
              </Stack>
            </Stack>
          </Flex>
          <Flex flex={1} alignSelf="center">
            <Image
              alt="Login Image"
              w={500}
              h={500}
              src={SignUpSvg}
              style={{ transform: [{ rotate: '90deg' }] }}
            />
          </Flex>
        </Stack>
      ) : (
        <FaceRegister
          handleImageChange={handleImageChange}
          handleRegister={handleRegister}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}
