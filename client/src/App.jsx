import React from 'react';
import {
  BrowserRouter
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './config/theme';
import Router from './config/Router';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ChakraProvider>
  );
}
