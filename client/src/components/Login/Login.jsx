/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image
} from '@chakra-ui/react';
import {
  ArrowForwardIcon
} from '@chakra-ui/icons';
import LoginSvg from '../../assets/login.svg';

export default function Register() {
  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={10} w="full" maxW="md">
          <Heading fontSize="2xl">Sign in to your account</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input focusBorderColor="purple.300" type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input focusBorderColor="purple.300" type="password" />
          </FormControl>
          <Stack spacing={4}>
            <Button rightIcon={<ArrowForwardIcon />} colorScheme="purple" bg="purple.300" variant="solid">
              Login
            </Button>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align="center"
              justify="center"
            >
              <Link color="purple.500">Dont have an account? Sign up</Link>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} alignSelf="center">
        <Image
          alt="Login Image"
          w={500}
          h={500}
          src={LoginSvg}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </Flex>
    </Stack>
  );
}
