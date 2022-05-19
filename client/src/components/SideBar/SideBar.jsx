/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import {
  FiMenu,
  FiChevronDown,
  FiHome,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import { CgOrganisation } from 'react-icons/cg';
import { MdOutlinePersonAdd, MdOutlinePeopleAlt } from 'react-icons/md';
import { logout } from '../../config/auth';
import AddNewMember from './AddNewMember';

export default function SidebarWithHeader({
  children, isAdmin, url, orgId
}) {
  const { isOpen: sideBarIsOpen, onOpen: sideBarOnOpen, onClose: sideBarOnClose } = useDisclosure();
  const { isOpen: modalIsOpen, onToggle: modalOnToggle, onClose: modalOnClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => sideBarOnClose}
        display={{ base: 'none', md: 'block' }}
        modalOnToggle={modalOnToggle}
        url={url}
      />
      <Drawer
        autoFocus={false}
        isOpen={sideBarIsOpen}
        placement="left"
        onClose={sideBarOnClose}
        returnFocusOnClose={false}
        onOverlayClick={sideBarOnClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={sideBarOnClose} modalOnToggle={modalOnToggle} url={url} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      {
        isAdmin && (
          <MobileNav onOpen={sideBarOnOpen} isAdmin={isAdmin} />
        )
      }
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
        <Modal isOpen={modalIsOpen} onClose={modalOnClose}>
          <ModalOverlay />
          <ModalContent p={6} minW="550px">
            <ModalCloseButton />
            <ModalBody>
              <AddNewMember orgId={orgId} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

function SidebarContent({
  onClose, url, modalOnToggle, ...rest
}) {
  const navigate = useNavigate();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <HStack>
          <BsEmojiSmile size={20} />
          <Text fontSize="2xl" fontWeight="bold">
            FaceFirst
          </Text>
        </HStack>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} onClick={() => navigate(url)}>
        Home
      </NavItem>
      <NavItem icon={MdOutlinePersonAdd} onClick={modalOnToggle}>
        Add Employee
      </NavItem>
      <NavItem icon={MdOutlinePeopleAlt} onClick={() => navigate(`${url}/employees`)}>
        Home
      </NavItem>
    </Box>
  );
}

function NavItem({ icon, children, ...rest }) {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'purple.400',
        color: 'white'
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white'
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
}

function MobileNav({ onOpen, isAdmin, ...rest }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout();
    navigate('/');
  };
  const username = localStorage.getItem('name');
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontWeight="bold"
      >
        FaceFirst
      </Text>

      <HStack spacing={{ base: '3', md: '6' }}>
        <IconButton
          onClick={toggleColorMode}
          icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
        />
        <IconButton
          aria-label="open menu"
          icon={<CgOrganisation />}
          onClick={() => navigate('/organizations')}
        />
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size="sm"
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {isAdmin ? 'Admin' : 'Employee'}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}
