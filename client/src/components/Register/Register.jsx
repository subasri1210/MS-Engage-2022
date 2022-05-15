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
import SignUpSvg from '../../assets/signuppage.svg';

export default function Register() {
  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={10} w="full" maxW="md">
          <Heading fontSize="2xl">Sign up</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input focusBorderColor="purple.300" type="email" />
          </FormControl>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input focusBorderColor="purple.300" type="text" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input focusBorderColor="purple.300" type="password" />
          </FormControl>
          <Stack spacing={4}>
            <Button rightIcon={<ArrowForwardIcon />} colorScheme="purple" bg="purple.300" variant="solid">
              Next
            </Button>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align="center"
              justify="center"
            >
              <Link color="purple.500">Already have an account? Sign in</Link>
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
  );
}
