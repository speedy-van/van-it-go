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
  Button,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';

type Booking = {
  id: string;
  referenceNumber: string;
  customerId: string;
  driverId: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  status: string;
  scheduledAt: string;
  quotePrice: string;
  serviceType: string;
  notes: string | null;
  pickupFloorNumber: number | null;
  pickupFlatUnit: string | null;
  pickupHasLift: boolean | null;
  pickupNotes: string | null;
  dropoffFloorNumber: number | null;
  dropoffFlatUnit: string | null;
  dropoffHasLift: boolean | null;
  dropoffNotes: string | null;
  hasCustomizedItems: boolean | null;
  createdAt: string;
};

export default function AdminBookingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const toast = useToast();

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

  const handleAccept = () => {
    if (!id || !booking || booking.status === 'cancelled') return;
    if (!confirm('Confirm this booking? The customer will receive an email.')) return;
    setAccepting(true);
    fetch(`/api/admin/bookings/${id}/accept`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooking((prev) => (prev ? { ...prev, status: 'accepted' } : null));
          toast({ title: data.message ?? 'Booking confirmed; customer notified', status: 'success', duration: 3000 });
        } else {
          toast({ title: data.error || 'Failed to accept', status: 'error', duration: 3000 });
        }
      })
      .catch(() => toast({ title: 'Failed to accept booking', status: 'error', duration: 3000 }))
      .finally(() => setAccepting(false));
  };

  const handleCancel = () => {
    if (!id || !booking || booking.status === 'cancelled') return;
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    setCancelling(true);
    fetch(`/api/bookings/${id}/cancel`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooking((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
          toast({ title: 'Booking cancelled', status: 'success', duration: 3000 });
        } else {
          toast({ title: data.error || 'Failed to cancel', status: 'error', duration: 3000 });
        }
      })
      .catch(() => toast({ title: 'Failed to cancel booking', status: 'error', duration: 3000 }))
      .finally(() => setCancelling(false));
  };

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
        <Link href="/admin/bookings">
          <Button mt={4}>Back to list</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Booking detail</Heading>
        <Link href="/admin/bookings">
          <Button variant="outline" size="sm">
            Back to list
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
          <Text fontSize="sm" color="gray.500">Created (booking made)</Text>
          <Text>
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleString()
              : '—'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Pickup</Text>
          <Text>{booking.pickupAddress}</Text>
          {(booking.pickupFlatUnit || (booking.pickupFloorNumber !== null && booking.pickupFloorNumber !== undefined && booking.pickupFloorNumber > 0)) && (
            <Text fontSize="sm" color="gray.400" mt={1}>
              {booking.pickupFlatUnit && `Flat/Unit: ${booking.pickupFlatUnit}`}
              {booking.pickupFlatUnit && booking.pickupFloorNumber !== null && booking.pickupFloorNumber !== undefined && booking.pickupFloorNumber > 0 && ' · '}
              {booking.pickupFloorNumber !== null && booking.pickupFloorNumber !== undefined && booking.pickupFloorNumber > 0 && (
                <>Floor: {booking.pickupFloorNumber}{booking.pickupHasLift ? ' (lift)' : ' (no lift)'}</>
              )}
            </Text>
          )}
          <Text fontSize="sm" color="gray.500" mt={2}>Pickup notes</Text>
          <Text fontSize="sm" color="#EBF1FF">{booking.pickupNotes || '—'}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Dropoff</Text>
          <Text>{booking.dropoffAddress}</Text>
          {(booking.dropoffFlatUnit || (booking.dropoffFloorNumber !== null && booking.dropoffFloorNumber !== undefined && booking.dropoffFloorNumber > 0)) && (
            <Text fontSize="sm" color="gray.400" mt={1}>
              {booking.dropoffFlatUnit && `Flat/Unit: ${booking.dropoffFlatUnit}`}
              {booking.dropoffFlatUnit && booking.dropoffFloorNumber !== null && booking.dropoffFloorNumber !== undefined && booking.dropoffFloorNumber > 0 && ' · '}
              {booking.dropoffFloorNumber !== null && booking.dropoffFloorNumber !== undefined && booking.dropoffFloorNumber > 0 && (
                <>Floor: {booking.dropoffFloorNumber}{booking.dropoffHasLift ? ' (lift)' : ' (no lift)'}</>
              )}
            </Text>
          )}
          <Text fontSize="sm" color="gray.500" mt={2}>Dropoff notes</Text>
          <Text fontSize="sm" color="#EBF1FF">{booking.dropoffNotes || '—'}</Text>
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
        {booking.notes && (
          <Box>
            <Text fontSize="sm" color="gray.500">General notes</Text>
            <Text>{booking.notes}</Text>
          </Box>
        )}
        {booking.hasCustomizedItems !== null && booking.hasCustomizedItems !== undefined && (
          <Box>
            <Text fontSize="sm" color="gray.500">Customized items</Text>
            <Text>{booking.hasCustomizedItems ? 'Yes' : 'No'}</Text>
          </Box>
        )}
        {booking.status !== 'cancelled' && (
          <HStack pt={4} spacing={3}>
            {booking.status === 'pending' && (
              <Button
                colorScheme="green"
                size="sm"
                isLoading={accepting}
                onClick={handleAccept}
              >
                Confirm booking
              </Button>
            )}
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              isLoading={cancelling}
              onClick={handleCancel}
            >
              Cancel booking
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
}
