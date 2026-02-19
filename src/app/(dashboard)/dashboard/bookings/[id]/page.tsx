'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

type Booking = {
  id: string;
  referenceNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: string;
  scheduledAt: string;
  quotePrice: string;
  serviceType: string;
  createdAt: string;
};

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setBooking(data.booking);
        } else {
          setError('Booking not found');
        }
      })
      .catch(() => setError('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxW="2xl" py={8}>
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container maxW="2xl" py={8}>
        <Text color="red">{error ?? 'Booking not found'}</Text>
        <Link href="/dashboard/bookings">
          <Button mt={4}>Back to my bookings</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Booking details</Heading>
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="sm">
            Back to my bookings
          </Button>
        </Link>
      </HStack>
      <VStack align="stretch" spacing={4}>
        <Box
          p={4}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <Text fontSize="sm" color="#EBF1FF" mb={1}>
            Reference number
          </Text>
          <Text fontSize="xl" fontWeight="bold" fontFamily="monospace">
            {booking.referenceNumber}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Status</Text>
          <Badge>{booking.status}</Badge>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Pickup</Text>
          <Text>{booking.pickupAddress}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Dropoff</Text>
          <Text>{booking.dropoffAddress}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Scheduled</Text>
          <Text>
            {booking.scheduledAt
              ? new Date(booking.scheduledAt).toLocaleString()
              : '—'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Quote</Text>
          <Text>£{booking.quotePrice}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Service type</Text>
          <Text>{booking.serviceType}</Text>
        </Box>
      </VStack>
    </Container>
  );
}
