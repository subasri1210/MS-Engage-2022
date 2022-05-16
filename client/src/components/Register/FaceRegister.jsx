import React, {
  useState, useRef, useCallback
} from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import {
  Flex,
  Heading,
  VStack,
  HStack,
  Button
} from '@chakra-ui/react';

import './styles.css';

export default function Register() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);

  const videoConstraints = {
    width: 750,
    height: 560,
    facingMode: 'user'
  };

  const captureImage = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const base64data = imageSrc.replace('data:image/jpeg;base64,', '');
      const bs = atob(base64data);
      const buffer = new ArrayBuffer(bs.length);
      const ba = new Uint8Array(buffer);
      for (let i = 0; i < bs.length; i += 1) {
        ba[i] = bs.charCodeAt(i);
      }
      const file = new File([ba], 'image.jpeg', { type: 'image/jpeg' });
      const blob = new Blob([ba], { type: 'image/jpeg' });
      setImageData(URL.createObjectURL(blob));
      setImage(file);
    },
    [webcamRef]
  );

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('Images', image);
    form.append('imageData', imageData);

    axios.post('http://localhost:3001/face/register', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        console.log(response);
        setImage(null);
        setImageData(null);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  return (

    <Flex p={8} flex={1} align="center" justify="center" flexDirection="column">
      <VStack
        spacing={10}
      >
        <Heading as="h4" size="md">
          Look into the screen and take a picture of your face.
        </Heading>

        {
          imageData
            ? <img src={imageData} alt="hello" />
            : (
              <Webcam
                id="video"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{ border: '4px solid white' }}
              />
            )
        }
        <HStack spacing={30}>
          <Button w={80} onClick={captureImage}>
            Capture Image
          </Button>
          <Button w={80}>
            Upload from your device
          </Button>
        </HStack>

        <Button
          w={80}
          colorScheme="purple"
          bg="purple.300"
          variant="solid"
        >
          Register
        </Button>

      </VStack>
    </Flex>
  );
}
