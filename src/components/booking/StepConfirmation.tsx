'use client';

import { Box, VStack, Heading, Text, Button, HStack, List, ListItem } from '@chakra-ui/react';
import Link from 'next/link';

interface StepConfirmationProps {
  bookingId?: string;
  referenceNumber?: string;
}

export function StepConfirmation({ bookingId, referenceNumber }: StepConfirmationProps) {
  const displayRef = referenceNumber ?? (bookingId ? `VG-····` : 'VG-····');

  return (
    <VStack spacing={8} align="center" textAlign="center" py={12}>
      <Box fontSize="48px">✅</Box>

      <Heading as="h1" size="xl" color="#FFB800">
        Booking Confirmed!
      </Heading>

      <Text fontSize="lg" color="#EBF1FF">
        Your moving booking has been successfully confirmed.
      </Text>

      <Box
        p={6}
        bg="#0F0F2A"
        borderRadius="10px"
        borderLeft="4px solid #7B2FFF"
        w="full"
        maxW="400px"
      >
        <Text fontSize="sm" color="#EBF1FF" mb={2}>
          Booking Reference
        </Text>
        <Text fontSize="24px" fontWeight="bold" fontFamily="monospace">
          {displayRef}
        </Text>
      </Box>

      <VStack spacing={4} color="#EBF1FF" maxW="500px" align="stretch">
        <Text>
          A confirmation email has been sent to your registered email address with:
        </Text>
        <List spacing={2} styleType="disc" pl={6} textAlign="left">
          <ListItem>Booking details and reference number</ListItem>
          <ListItem>Driver assignment confirmation</ListItem>
          <ListItem>Real-time location tracking link</ListItem>
          <ListItem>Invoice and payment receipt</ListItem>
        </List>
      </VStack>

      <HStack spacing={4} pt={6}>
        <Link href="/dashboard/bookings">
          <Button variant="outline" color="#7B2FFF">
            View Booking
          </Button>
        </Link>
        <Link href="/">
          <Button bg="#FFB800" color="#06061A">
            Back to Home
          </Button>
        </Link>
      </HStack>

      <Text fontSize="sm" color="#EBF1FF" pt={8}>
        Your driver will contact you within 2 hours to confirm the exact time.
      </Text>
    </VStack>
  );
}
