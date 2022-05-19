/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
  Container,
  Stack,
  Heading,
  Box,
  Button
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, WarningTwoIcon, InfoIcon } from '@chakra-ui/icons';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import Attendance from './Attendance';

function EmployeeDashBoard({ orgData }) {
  let statData = null;
  const [timeStatus, setTimeStatus] = useState('none');
  const [attStatus, setAttStatus] = useState('none');
  const [showAttPage, setShowAttPage] = useState(false);

  useEffect(() => {
    if (orgData) {
      const timeNow = new Date();
      const hours = timeNow.getHours();
      const minutes = timeNow.getMinutes();
      const timeString = `${hours}:${minutes}`;
      if (orgData.organisationInTime.start <= timeString
        && orgData.organisationInTime.end >= timeString) {
        setTimeStatus('intime');
      } else if (orgData.organisationOutTime.start <= timeString
        && orgData.organisationOutTime.end >= timeString) {
        setTimeStatus('outtime');
      } else {
        setTimeStatus('none');
      }

      if (orgData.attendanceResponse === 'Not marked in') {
        setAttStatus('notin');
      } else if (orgData.attendanceResponse === 'In') {
        setAttStatus('in');
      } else {
        setAttStatus('out');
      }
    }
  }, [orgData]);

  if (orgData) {
    statData = [
      {
        id: 1,
        label: 'Your Attendance',
        value: orgData.attendanceResponse,
        icon: AiOutlineUser
      },
      {
        id: 2,
        label: 'Organisation In-time',
        value: `${orgData.organisationInTime.start} - ${orgData.organisationInTime.end} IST`,
        icon: FaSignInAlt
      },
      {
        id: 2,
        label: 'Organisation Out-time',
        value: `${orgData.organisationOutTime.start} - ${orgData.organisationOutTime.end} IST`,
        icon: FaSignOutAlt
      }
    ];
  }

  const getHeaderText = () => {
    if (timeStatus === 'none') {
      return 'You can mark your attendance only during in the organisation in-time or out-time!';
    } if (timeStatus === 'intime' && attStatus === 'notin') {
      return 'You have not marked your in-time yet!';
    } if (timeStatus === 'intime' && attStatus === 'in') {
      return 'You have marked your in-time. Come back at out-time!';
    } if (timeStatus === 'outtime' && attStatus === 'notin') {
      return 'You have not marked your in-time, so you cannot mark your out-time now!';
    } if (timeStatus === 'outtime' && attStatus === 'in') {
      return 'You have not marked your out-time yet!';
    } if (timeStatus === 'outtime' && attStatus === 'out') {
      return 'You have marked your out-time!';
    }
    return 'Something went wrong! Try again later!';
  };

  const getHeaderIcon = () => {
    console.log('inside getHeaderIcon');
    if (timeStatus === 'none') {
      return <WarningTwoIcon boxSize="50px" color="purple.300" />;
    } if (timeStatus === 'intime' && attStatus === 'notin') {
      return <InfoIcon boxSize="50px" color="purple.500" />;
    } if (timeStatus === 'intime' && attStatus === 'in') {
      return <CheckCircleIcon boxSize="50px" color="purple.500" />;
    } if (timeStatus === 'outtime' && attStatus === 'notin') {
      return <WarningTwoIcon boxSize="50px" color="purple.300" />;
    } if (timeStatus === 'outtime' && attStatus === 'in') {
      return <InfoIcon boxSize="50px" color="purple.500" />;
    } if (timeStatus === 'outtime' && attStatus === 'out') {
      return <CheckCircleIcon boxSize="50px" color="purple.500" />;
    }
    return <WarningTwoIcon boxSize="50px" color="purple.300" />;
  };

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      {
        !showAttPage ? (
          <VStack spacing={10}>
            <Heading as="h4" size="md">
              Organisation name
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mt={6} mb={4}>
              {statData && statData.map((data) => (
                <Card data={data} />
              ))}
            </SimpleGrid>
            <Box textAlign="center">
              {getHeaderIcon()}
              <Heading as="h4" size="md" maxW={500} mt={5} lineHeight="150%">
                {getHeaderText()}
              </Heading>
            </Box>
            {
              ((timeStatus === 'intime' && attStatus === 'notin')
              || (timeStatus === 'outtime' && attStatus === 'in')) && (
                <Button
                  colorScheme="brand"
                  variant="outline"
                  p={5}
                  mt={15}
                  onClick={() => setShowAttPage(true)}
                >
                  Mark your attendance
                </Button>
              )
            }
          </VStack>
        ) : (
          <Attendance orgId={orgData.orgId} />
        )
      }
    </Container>
  );
}

function Card({ data }) {
  return (
    <motion.div whileHover={{ translateY: -5 }}>
      <Stack
        direction="column"
        rounded="md"
        boxShadow={useColorModeValue(
          '0 4px 6px rgba(160, 174, 192, 0.6)',
          '2px 4px 6px rgba(9, 17, 28, 0.9)'
        )}
        w="100%"
        textAlign="left"
        align="start"
        spacing={0}
        role="group"
        overflow="hidden"
      >
        <HStack py={6} px={5} spacing={4} bg={useColorModeValue('gray.100', 'gray.800')} w="100%">
          <Flex
            justify="center"
            alignItems="center"
            rounded="lg"
            p={2}
            bg="purple.400"
            position="relative"
            w={12}
            h={12}
            overflow="hidden"
            lineHeight={0}
            boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
          >
            <Icon as={data.icon} w={6} h={6} color="white" />
          </Flex>
          <VStack spacing={0} align="start" maxW="lg" h="100%">
            <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
              {data.label}
            </Text>
            <HStack spacing={2}>
              <Text as="h2" fontSize="lg" fontWeight="extrabold">
                {data.value}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Stack>
    </motion.div>
  );
}

EmployeeDashBoard.propTypes = {
  orgData: PropTypes.object.isRequired
};

export default EmployeeDashBoard;
