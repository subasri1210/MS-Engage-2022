import React from 'react';
import {
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Image
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import HeroPageImage from '../../assets/heropageimage.svg';

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container maxW="5xl">
      <Stack
        textAlign="center"
        align="center"
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={500}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight="110%"
        >
          Tracking Attendance
          {' '}
          <Text as="span" color="purple.400">
            made easy
          </Text>
        </Heading>
        <Text color="gray.500" maxW="3xl">
          One stop solution for managers and employees to mark and
          track their attendance! Manage the attendance record and analysis of
          your organisation in a smart and professional way!
        </Text>
        <Stack spacing={6} pb={10} direction="row">
          <Button
            rounded="full"
            px={10}
            py={6}
          >
            Get started
          </Button>
          <Button
            rounded="full"
            px={10}
            py={6}
            onClick={() => { navigate('/login'); }}
            width={40}
          >
            Login
          </Button>
        </Stack>
        <Image src={HeroPageImage} alt="Bug fixing" w={500} h={500} />
      </Stack>
    </Container>
  );
}
