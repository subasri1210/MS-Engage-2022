/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import React from 'react';
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
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Spacer,
  Box,
  Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { FiUser, FiUserX } from 'react-icons/fi';
import NoEmployeeSvg from '../../assets/no_employees.svg';

function AdminDashBoard({ orgData }) {
  console.log('orgData', orgData);
  let statData = null;
  if (orgData) {
    statData = [
      {
        id: 1,
        label: 'Total Employees',
        value: orgData.totalEmployees,
        icon: FiUser
      },
      {
        id: 2,
        label: 'Total Ins',
        value: orgData.totalIns.length,
        icon: FaSignInAlt
      },
      {
        id: 3,
        label: 'Total Outs',
        value: orgData.totalOuts.length,
        icon: FaSignOutAlt
      },
      {
        id: 4,
        label: 'Total Absent',
        value: `${orgData.totalEmployees - orgData.totalIns.length}`,
        icon: FiUserX
      }
    ];
  }

  return (
    <Container maxW="6xl">
      <VStack spacing={10}>
        <Heading as="h4" size="md" align="start">
          {orgData ? orgData.orgName : 'Organisation Name'}
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={7} mt={6} mb={4}>
          {statData && statData.map((data) => (
            <Card data={data} />
          ))}
        </SimpleGrid>
      </VStack>
      <Spacer />
      {
        orgData.totalEmployees !== 0 ? (
          <>
            <Flex mt={20}>
              <Box>
                <Heading as="h4" size="md">
                  Today&apos;s attendance log
                </Heading>
              </Box>
              <Spacer />
              <Box>
                <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
                  Organisation In-time :
                  {' '}
                  {orgData.organisationInTime.start}
                  {' '}
                  -
                  {' '}
                  {orgData.organisationInTime.end}
                </Text>
                <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
                  Organisation Out-time :
                  {' '}
                  {orgData.organisationOutTime.start}
                  {' '}
                  -
                  {' '}
                  {orgData.organisationOutTime.end}
                </Text>
              </Box>
            </Flex>
            <LogTable attData={orgData.attendanceLog} />
          </>
        ) : (
          <Stack align="center" mt={10}>
            <Heading fontWeight="semibold" fontSize="md">
              Add Employees to your organisation to view their attendance log!
            </Heading>
            <Image src={NoEmployeeSvg} alt="No Employees" w={500} h={500} />
          </Stack>
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

function LogTable({ attData }) {
  const header = ['S.No', 'Name', 'In Time', 'Out Time', 'Status'];
  const logData = attData.map((data, index) => ({
    index: index + 1,
    name: data.name,
    inTime: data.intime,
    outTime: data.outime,
    status: data.status
  }));
  const color1 = useColorModeValue('gray.400', 'gray.400');

  return (
    <Flex
      w="full"
      pt={30}
      alignItems="center"
      justifyContent="center"
    >
      <Table
        w="full"
        bg={useColorModeValue('white', 'gray.800')}
        display={{
          base: 'block',
          md: 'table'
        }}
        sx={{
          '@media print': {
            display: 'table'
          }
        }}
      >
        <Thead
          display={{
            base: 'none',
            md: 'table-header-group'
          }}
          sx={{
            '@media print': {
              display: 'table-header-group'
            }
          }}
        >
          <Tr>
            {header.map((x) => (
              <Th key={x}>{x}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody
          display={{
            base: 'block',
            lg: 'table-row-group'
          }}
          sx={{
            '@media print': {
              display: 'table-row-group'
            }
          }}
        >
          {logData.map((token, tid) => (
            <Tr
              key={tid}
              display={{
                base: 'grid',
                md: 'table-row'
              }}
              sx={{
                '@media print': {
                  display: 'table-row'
                },
                gridTemplateColumns: 'minmax(0px, 35%) minmax(0px, 65%)',
                gridGap: '10px'
              }}
            >
              {Object.keys(token).map((tdata) => (
                <React.Fragment key={`${tid}${tdata}`}>
                  <Td
                    display={{
                      base: 'table-cell',
                      md: 'none'
                    }}
                    sx={{
                      '@media print': {
                        display: 'none'
                      },
                      textTransform: 'uppercase',
                      color: color1,
                      fontSize: 'xs',
                      fontWeight: 'bold',
                      letterSpacing: 'wider',
                      fontFamily: 'heading'
                    }}
                  >
                    {tdata}
                  </Td>
                  <Td
                    color="gray.500"
                    fontSize="md"
                  >
                    {token[tdata]}
                  </Td>
                </React.Fragment>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
}

AdminDashBoard.propTypes = {
  orgData: PropTypes.object.isRequired
};

export default AdminDashBoard;
