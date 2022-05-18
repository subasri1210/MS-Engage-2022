import React from 'react';
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
  useColorMode
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { CgOrganisation } from 'react-icons/cg';
import { logout } from '../../config/auth';

export default function Gslr() {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <chakra.header
      bg={bg}
      w="full"
      px={{ base: 2, sm: 4 }}
      py={4}
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <Flex>
          <chakra.a
            href="/"
            title="Choc Home Page"
            display="flex"
            alignItems="center"
          >
            <BsEmojiSmile size={30} />
          </chakra.a>
          <chakra.h1 fontSize="3xl" fontWeight={500} ml="2">
            FaceFirst
          </chakra.h1>
        </Flex>
        <HStack display="flex" alignItems="center" spacing={1}>
          <HStack
            spacing={5}
            mr={1}
            display={{ base: 'none', md: 'inline-flex' }}
          >
            <IconButton
              icon={<CgOrganisation />}
            />
            <IconButton
              icon={<AiOutlineUser />}
            />
            <IconButton
              icon={<FiLogOut />}
              onClick={handleLogout}
            />
            <IconButton
              onClick={toggleColorMode}
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
            />
          </HStack>
          <Box display={{ base: 'inline-flex', md: 'none' }}>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              fontSize="20px"
              color={useColorModeValue('gray.800', 'inherit')}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />
            <VStack
              pos="absolute"
              top={0}
              left={0}
              right={0}
              display={mobileNav.isOpen ? 'flex' : 'none'}
              flexDirection="column"
              p={2}
              pb={4}
              m={2}
              bg={bg}
              spacing={3}
              rounded="sm"
              shadow="sm"
            >
              <CloseButton
                aria-label="Close menu"
                onClick={mobileNav.onClose}
              />
              <Button w="full" variant="ghost">
                Organisation
              </Button>
              <Button w="full" variant="ghost" onClick={toggleColorMode}>
                Switch to
                {' '}
                {colorMode === 'dark' ? 'light' : 'dark'}
                {' '}
                mode
              </Button>
              <Button w="full" variant="ghost">
                Profile
              </Button>
              <Button w="full" variant="ghost">
                Logout
              </Button>
            </VStack>
          </Box>
        </HStack>
      </Flex>
    </chakra.header>
  );
}
