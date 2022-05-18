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
  useColorMode
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

export default function SidebarWithHeader({
  children, isAdmin, url
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} url={url} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      {
        isAdmin && (
          <MobileNav onOpen={onOpen} isAdmin={isAdmin} />
        )
      }
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

function SidebarContent({ onClose, url, ...rest }) {
  const navigate = useNavigate();
  const LinkItems = [
    { name: 'Home', icon: FiHome, url },
    { name: 'Add Employee', icon: MdOutlinePersonAdd, url: `${url}/add-employee` },
    { name: 'Employees', icon: MdOutlinePeopleAlt, url: `${url}/employees` }
  ];
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
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => navigate(link.url)}
        >
          {link.name}
        </NavItem>
      ))}
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

      <HStack spacing={{ base: '0', md: '6' }}>
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
