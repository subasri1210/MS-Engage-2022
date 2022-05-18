import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './config/theme';
import Router from './config/Router';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  );
}
