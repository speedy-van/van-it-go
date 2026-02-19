'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Spinner,
  Badge,
  Button,
  HStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';

type BookingRow = {
  id: string;
  referenceNumber: string | null;
  customerId: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupNotes: string | null;
  dropoffNotes: string | null;
  scheduledAt: string | null;
  quotePrice: string;
  notes: string | null;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const toast = useToast();

  const loadBookings = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setError('Failed to load bookings');
        }
      })
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = (id: string) => {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    setCancellingId(id);
    fetch(`/api/bookings/${id}/cancel`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === id ? { ...b, status: 'cancelled' } : b
            )
          );
          toast({ title: 'Booking cancelled', status: 'success', duration: 3000 });
        } else {
          toast({ title: data.error || 'Failed to cancel', status: 'error', duration: 3000 });
        }
      })
      .catch(() => {
        toast({ title: 'Failed to cancel booking', status: 'error', duration: 3000 });
      })
      .finally(() => setCancellingId(null));
  };

  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={6} color="#EBF1FF">
        Bookings
      </Heading>

      <HStack mb={6} flexWrap="wrap" gap={4}>
        <FormControl maxW="200px">
          <FormLabel fontSize="sm" color="gray.400">From date</FormLabel>
          <Input
            type="date"
            size="sm"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.200"
            color="#EBF1FF"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FormControl>
        <FormControl maxW="200px">
          <FormLabel fontSize="sm" color="gray.400">To date</FormLabel>
          <Input
            type="date"
            size="sm"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.200"
            color="#EBF1FF"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </FormControl>
        <Button size="sm" colorScheme="purple" mt={8} onClick={loadBookings}>
          Apply filter
        </Button>
      </HStack>

      {loading ? (
        <HStack justify="center" py={12}>
          <Spinner size="lg" color="#7B2FFF" />
        </HStack>
      ) : error ? (
        <Text color="red.400">{error}</Text>
      ) : (
        <TableContainer bg="#0F0F2A" borderRadius="lg" borderLeft="4px solid #7B2FFF">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th color="gray.400">Reference</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Pickup</Th>
                <Th color="gray.400">Pickup notes</Th>
                <Th color="gray.400">Dropoff</Th>
                <Th color="gray.400">Dropoff notes</Th>
                <Th color="gray.400">Scheduled</Th>
                <Th color="gray.400">Quote</Th>
                <Th color="gray.400">Created</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.length === 0 ? (
                <Tr>
                  <Td colSpan={10} color="gray.500">
                    No bookings found.
                  </Td>
                </Tr>
              ) : (
                bookings.map((b) => (
                  <Tr key={b.id}>
                    <Td fontFamily="monospace" fontWeight="bold" color="#EBF1FF">
                      {b.referenceNumber ?? b.id.slice(0, 8)}
                    </Td>
                    <Td>
                      <Badge colorScheme={b.status === 'cancelled' ? 'red' : 'purple'}>
                        {b.status}
                      </Badge>
                    </Td>
                    <Td maxW="180px" isTruncated color="#EBF1FF" title={b.pickupAddress}>
                      {b.pickupAddress}
                    </Td>
                    <Td maxW="160px" isTruncated color="#EBF1FF" title={b.pickupNotes ?? ''}>
                      {b.pickupNotes || '—'}
                    </Td>
                    <Td maxW="180px" isTruncated color="#EBF1FF" title={b.dropoffAddress}>
                      {b.dropoffAddress}
                    </Td>
                    <Td maxW="160px" isTruncated color="#EBF1FF" title={b.dropoffNotes ?? ''}>
                      {b.dropoffNotes || '—'}
                    </Td>
                    <Td color="#EBF1FF">
                      {b.scheduledAt
                        ? new Date(b.scheduledAt).toLocaleString()
                        : '—'}
                    </Td>
                    <Td color="#EBF1FF">£{b.quotePrice}</Td>
                    <Td color="#EBF1FF" fontSize="xs">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleString()
                        : '—'}
                    </Td>
                    <Td>
                      <HStack gap={2}>
                        <Link href={`/admin/bookings/${b.id}`}>
                          <Button size="xs" variant="outline" colorScheme="purple">
                            View
                          </Button>
                        </Link>
                        {b.status !== 'cancelled' && (
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="outline"
                            isLoading={cancellingId === b.id}
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
