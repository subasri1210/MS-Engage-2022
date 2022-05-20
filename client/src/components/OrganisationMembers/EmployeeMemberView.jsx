/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  useColorModeValue,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Container,
  Heading,
  Box
} from '@chakra-ui/react';

export function EmployeeMemberView({ admins, members }) {
  return (
    <Container maxW="6xl" mt={10}>
      <Box>
        <Heading as="h4" size="md">
          Admins
        </Heading>
        <LogTable memberData={admins} />
      </Box>
      <Box mt={10}>
        {
          members.length !== 0 ? (
            <>
              <Heading as="h4" size="md">
                Employees
              </Heading>
              <LogTable memberData={members} />
            </>
          ) : (
            ''
          )
        }

      </Box>
    </Container>

  );
}

function LogTable({ memberData }) {
  const header = ['S.No', 'Name', 'Email'];
  const logData = memberData.map((data, index) => ({
    index: index + 1,
    name: data.name,
    email: data.email
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
