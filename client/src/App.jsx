import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'

const App = () => {
    return (
        <ChakraProvider>
            <div>
                <h1>Init App</h1>
            </div>
        </ChakraProvider>
    );
};

export default App;
