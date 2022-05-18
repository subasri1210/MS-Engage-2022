import React from 'react';
import PropTypes from 'prop-types';
import { Text, useColorModeValue, VStack } from '@chakra-ui/react';

function OrgCard({ name, description, onClick }) {
  const cardBg = useColorModeValue('gray.300', 'gray.900');

  return (
    <VStack
      px={8}
      py={4}
      spacing={1}
      align="start"
      minW={100}
      rounded="xl"
      bgColor={cardBg}
      shadow="sm"
      transition="all .2s ease"
      _hover={{ shadow: 'xl', cursor: 'pointer' }}
      onClick={onClick}
    >
      <Text fontWeight="semibold">{name}</Text>
      <Text>{description}</Text>
    </VStack>
  );
}

OrgCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default OrgCard;
