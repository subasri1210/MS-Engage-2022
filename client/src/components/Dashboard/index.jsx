/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Spacer,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Stack,
  Image
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Nav';
import OrgCard from './OrgCard';
import CreateOrgForm from './CreateOrgForm';
import NoOrgsSvg from '../../assets/no_orgs.svg';

export default function Organization({ userData, userOrgs }) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const navigate = useNavigate();
  console.log('user data', userData);
  console.log('user orgs', userOrgs);
  let orgLength = 0;
  if (userOrgs) {
    orgLength = userOrgs.length;
  }

  return (
    <>
      <Navbar />
      <Container maxW="container.lg">
        <Stack direction={['column', 'column', 'row']} align={['center', 'center', 'end']} mb={8}>
          <Box mt={10}>
            <Heading fontWeight="semibold">Your organizations</Heading>
          </Box>
          <Spacer />
          <Button onClick={onToggle}>Create new organization</Button>
        </Stack>
        { orgLength === 0 && (
          <Stack align="center">
            <Image src={NoOrgsSvg} alt="No organisation" w={500} h={500} />
            <Heading fontWeight="semibold" fontSize="md">
              You are not a part of any organizations yet! Create one now!
            </Heading>
          </Stack>
        )}
        <SimpleGrid columns={[1, 1, 2]} spacing={5}>
          {
            userOrgs && userOrgs.map((org) => (
              <OrgCard
                key={org.orgId}
                name={org.name}
                description={org.description}
                onClick={() => navigate(`/organizations/${org.orgId}`, { state: org })}
              />
            ))
          }
        </SimpleGrid>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={6} minW="550px">
          <ModalCloseButton />
          <ModalBody>
            <CreateOrgForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

Organization.propTypes = {
  userData: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired,
  userOrgs: PropTypes.arrayOf(PropTypes.shape(
    {
      orgId: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      inTime: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string
      }),
      outTime: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string
      }),
      location: PropTypes.any
    }
  )).isRequired
};
