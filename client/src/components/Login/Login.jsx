/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormHelperText,
  InputRightElement,
  Divider,
  useToast,
  useBoolean
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  FiMail, FiLock, FiEye, FiEyeOff
} from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import axios from 'axios';
import LoginSvg from '../../assets/login.svg';
import { BACKEND_URL } from '../../config/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [isVisible, setVisible] = useBoolean();
  const [isLoading, setIsLoading] = useBoolean();
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleLoading = () => { setIsLoading.toggle(); };

  const handleLogin = async () => {
    if (!email.match(/@{1}/) || email.match(/^@|@$/)) {
      setEmailInvalid(true);
      return;
    }
    setEmailInvalid(false);

    handleLoading();

    await axios({
      method: 'post',
      url: `${BACKEND_URL}/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => {
        handleLoading();
        console.log(res.data);
        navigate('/');
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
      });
  };

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={10} w="full" maxW="md">
          <Heading fontSize="2xl">Sign in to your account</Heading>
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
          <FormControl id="password" isRequired>
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
          </FormControl>
          <Stack spacing={4}>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="purple"
              bg="purple.300"
              variant="solid"
              isLoading={isLoading}
              loadingText="Logging in"
              onClick={handleLogin}
            >
              Login
            </Button>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align="center"
              justify="center"
            >
              <Link href="/register" color="purple.500">
                Dont have an account? Sign up
              </Link>
            </Stack>
            <Divider />
            <Button
              rightIcon={<BsEmojiSmile />}
              colorScheme="purple"
              bg="purple.300"
              variant="solid"
              onClick={() => navigate('/facelogin')}
              mt={15}
            >
              Login with your face
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} alignSelf="center">
        <Image
          alt="Login Image"
          w={500}
          h={500}
          src={LoginSvg}
        />
      </Flex>
    </Stack>
  );
}
