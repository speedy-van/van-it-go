'use client';

import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import Link from 'next/link';

type BookingRow = {
  id: string;
  referenceNumber: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: string;
  quotePrice: string;
};

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In production, customerId comes from session
    const customerId = typeof window !== 'undefined' ? localStorage.getItem('customerId') ?? '' : '';
    if (!customerId) {
      setBookings([]);
      setLoading(false);
      return;
    }
    fetch(`/api/bookings?customerId=${encodeURIComponent(customerId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setError(data.error ?? 'Failed to load bookings');
        }
      })
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxW="6xl" py={8}>
        <Spinner size="lg" />
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <Heading size="lg" mb={6}>
        My Bookings
      </Heading>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Reference</Th>
              <Th>Status</Th>
              <Th>Pickup</Th>
              <Th>Dropoff</Th>
              <Th>Scheduled</Th>
              <Th>Quote</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.length === 0 ? (
              <Tr>
                <Td colSpan={7}>
                  <Text color="gray.500">
                    {error ?? 'No bookings. Complete a booking from the Book section.'}
                  </Text>
                </Td>
              </Tr>
            ) : (
              bookings.map((b) => (
                <Tr key={b.id}>
                  <Td fontFamily="monospace" fontWeight="bold">
                    {b.referenceNumber}
                  </Td>
                  <Td>{b.status}</Td>
                  <Td maxW="180px" isTruncated title={b.pickupAddress}>
                    {b.pickupAddress}
                  </Td>
                  <Td maxW="180px" isTruncated title={b.dropoffAddress}>
                    {b.dropoffAddress}
                  </Td>
                  <Td>
                    {b.scheduledAt
                      ? new Date(b.scheduledAt).toLocaleDateString()
                      : '—'}
                  </Td>
                  <Td>£{b.quotePrice}</Td>
                  <Td>
                    <Link href={`/dashboard/bookings/${b.id}`}>View</Link>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
