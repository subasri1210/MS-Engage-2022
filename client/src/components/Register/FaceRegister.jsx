import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Flex,
  VStack,
  Heading,
  HStack,
  Button,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  FiRefreshCcw
} from 'react-icons/fi';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import './styles.css';

export default function FaceRegister({ handleImageChange, handleRegister, isLoading }) {
  const height = 560;
  const width = 720;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    function addEvent() {
      video.addEventListener('play', () => {
        console.log('addEvent');
        const canvas = faceapi.createCanvas(video);
        canvas.id = 'canvas';
        document.querySelector('#video').append(canvas);
        document.querySelector('#video-container').append(canvas);
        const displaySize = { width, height };
        faceapi.matchDimensions(canvas, displaySize);
        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          canvas
            .getContext('2d')
            .clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 100);
      });
    }
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(() => {
      if (navigator.mediaDevices.getUserMedia) {
        setVideo(document.getElementById('video'));
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: true })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
            console.log(`Video : ${video}`);
            addEvent();
          })
          .catch((e) => {
            console.log(`${e.name}: ${e.message}`);
          });
      }
    });
  });

  const captureImage = useCallback(
    () => {
      const imageSrc = videoRef.current.getScreenshot();
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
      handleImageChange(file);
      setImageCaptured(true);
    },
    [videoRef]
  );

  const handleImageDataChange = (event) => {
    handleImageChange(event.target.files[0]);
    setImageData(URL.createObjectURL(event.target.files[0]));
    setImageCaptured(true);
  };

  const handleClearImage = () => {
    handleImageChange(null);
    setImageData(null);
    setImageCaptured(false);
  };

  return (
    <>
      <Flex p={8} flex={1} align="center" justify="center" flexDirection="column" />
      <VStack
        spacing={10}
      >
        <Heading as="h4" size="md">
          Look into the screen and take a picture of your face.
        </Heading>
        {imageData
          ? <img width="720px" height="560px" src={imageData} alt="hello" />
          : (
            <Box id="video-container">
              <Webcam
                id="video"
                ref={videoRef}
                autoPlay
                width={width}
                height={height}
                playsInline
                muted
                style={{ width: '720px', height: '560px' }}
                screenshotFormat="image/jpeg"
              />
              <canvas
                id="canvas"
                ref={canvasRef}
                style={{ width: '720px', height: '560px' }}
              />
            </Box>
          )}
        <VStack
          style={(!imageCaptured) ? { marginTop: '600px', marginBottom: '30px' } : { marginBottom: '30px' }}
          spacing={10}
        >
          <HStack spacing={30} align="center">
            <Button w={80} onClick={captureImage}>
              Capture Image
            </Button>
            <input
              type="file"
              onChange={handleImageDataChange}
              style={{ width: '230px' }}
              title="Upload Image from your device"
            />
            {imageCaptured && (
              <Tooltip label="Clear uploaded image">
                <IconButton
                  variant="outline"
                  fontSize="20px"
                  icon={<FiRefreshCcw />}
                  onClick={handleClearImage}
                />
              </Tooltip>
            )}

          </HStack>

          <Button
            w={80}
            colorScheme="purple"
            bg="purple.300"
            variant="solid"
            onClick={handleRegister}
            mb={20}
            isLoading={isLoading}
            loadingText="Registering"
            disabled={!imageCaptured || isLoading}
          >
            Register
          </Button>
        </VStack>
      </VStack>
      <Flex />
    </>
  );
}

FaceRegister.propTypes = {
  handleImageChange: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};
