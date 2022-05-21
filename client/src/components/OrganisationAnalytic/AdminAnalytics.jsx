/* eslint-disable react/prop-types */
import React from 'react';
import {
  Container,
  Box,
  Heading,
  VStack,
  useColorMode,
  HStack,
  Select
} from '@chakra-ui/react';
import { DatePicker } from 'chakra-ui-date-input';
import { Bar } from 'react-chartjs-2';

export default function AdminAnalytics({
  dateValue, handleChangeDateValue, dateAnalytics, monthValue,
  yearValue, handleMonthValue, handleYearValue, monthAnalytics,
  totalEmployees
}) {
  const { colorMode } = useColorMode();
  const getYears = () => {
    const years = [];
    for (let i = new Date().getFullYear(); i >= 2000; i -= 1) {
      years.push(<option value={i}>{i}</option>);
    }
    return years;
  };

  const options = {
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: colorMode === 'dark' ? '#CCC' : 'black'
          },
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: dateAnalytics.notMarkedIn + dateAnalytics.inData + dateAnalytics.outData,
            stepSize: 1,
            fontColor: colorMode === 'dark' ? '#CCC' : 'black'
          },
          gridLines: {
            color: colorMode === 'dark' ? '#d0cfd3' : 'black'
          }
        }
      ]
    }
  };

  const monthOptions = {
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: colorMode === 'dark' ? '#CCC' : 'black'
          },
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: totalEmployees * 28,
            stepSize: 4,
            fontColor: colorMode === 'dark' ? '#CCC' : 'black'
          },
          gridLines: {
            color: colorMode === 'dark' ? '#d0cfd3' : 'black'
          }
        }
      ]
    }
  };

  const barChartData = {
    labels: ['Absent', 'In', 'Out'],
    datasets: [
      {
        label: 'Attendance record',
        data: [dateAnalytics.notMarkedIn, dateAnalytics.inData, dateAnalytics.outData],
        borderColor: ['rgba(178, 7, 250, 0.2)', 'rgba(178, 7, 250, 0.2)', 'rgba(178, 7, 250, 0.2)'],
        backgroundColor: ['rgb(160, 125, 237)', 'rgb(160, 125, 237)', 'rgb(160, 125, 237)']
      }
    ]
  };

  const monthBarChartData = {
    labels: ['Absent', 'In', 'Out'],
    datasets: [
      {
        label: 'Attendance record',
        data: [monthAnalytics.monthNotMarkedIn,
          monthAnalytics.monthInData,
          monthAnalytics.monthOutData],
        borderColor: ['rgba(178, 7, 250, 0.2)', 'rgba(178, 7, 250, 0.2)', 'rgba(178, 7, 250, 0.2)'],
        backgroundColor: ['rgb(160, 125, 237)', 'rgb(160, 125, 237)', 'rgb(160, 125, 237)']
      }
    ]
  };

  return (
    <Container maxW="6xl" mt={10}>
      <VStack spacing={10} align="start">
        <Heading as="h4" size="md">
          Attendance Analytics by Date
        </Heading>
        <Box maxW="40">
          <DatePicker
            value={dateValue}
            name="date"
            dateFormat="YYYY-MM-DD"
            onChange={(date) => handleChangeDateValue(date)}
          />
        </Box>
      </VStack>
      <VStack spacing={10} align="start" mt={10}>
        <Box width="2xl">
          <Bar data={barChartData} options={options} />
        </Box>
      </VStack>

      <VStack spacing={10} align="start" mt={20}>
        <Heading as="h4" size="md">
          Attendance Analytics by Month
        </Heading>
        <Box maxW="8xl">
          <HStack spacing={10}>
            <Select
              placeholder="Select Month"
              value={monthValue}
              onChange={(e) => handleMonthValue(e.target.value)}
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Select>
            <Select
              placeholder="Select Year"
              value={yearValue}
              onChange={(e) => handleYearValue(e.target.value)}
            >
              {getYears()}
            </Select>
          </HStack>
        </Box>
      </VStack>
      <VStack spacing={10} align="start" mt={10}>
        <Box width="2xl">
          <Bar data={monthBarChartData} options={monthOptions} />
        </Box>
      </VStack>
    </Container>
  );
}
