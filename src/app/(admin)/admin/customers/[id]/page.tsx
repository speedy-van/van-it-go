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
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from '@chakra-ui/react';
import Link from 'next/link';

type Customer = {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type Booking = {
  id: string;
  referenceNumber: string | null;
  status: string;
  pickupAddress: string;
  scheduledAt: string | null;
  quotePrice: string;
  createdAt: string | null;
};

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customer) {
          setCustomer(data.customer);
          setBookings(data.bookings ?? []);
        } else {
          setError('Customer not found');
        }
      })
      .catch(() => setError('Failed to load customer'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxW="2xl" py={8}>
        <HStack justify="center">
          <Spinner size="lg" color="#7B2FFF" />
        </HStack>
      </Container>
    );
  }

  if (error || !customer) {
    return (
      <Container maxW="2xl" py={8}>
        <Text color="red.400">{error ?? 'Customer not found'}</Text>
        <Link href="/admin/customers">
          <Button mt={4} size="sm">Back to customers</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="full" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="#EBF1FF">Customer detail</Heading>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm" colorScheme="purple">Back to list</Button>
        </Link>
      </HStack>
      <VStack align="stretch" spacing={6}>
        <Box p={6} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
          <Text fontSize="sm" color="gray.400" mb={1}>Name</Text>
          <Text fontSize="xl" fontWeight="bold" color="#EBF1FF">{customer.name ?? '—'}</Text>
          <Text fontSize="sm" color="gray.400" mt={2}>Email</Text>
          <Text color="#EBF1FF">{customer.email ?? '—'}</Text>
          <Text fontSize="sm" color="gray.400" mt={2}>Email verified</Text>
          <Text color="#EBF1FF">{customer.emailVerified ? 'Yes' : 'No'}</Text>
          <Text fontSize="sm" color="gray.400" mt={2}>Joined</Text>
          <Text color="#EBF1FF">
            {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '—'}
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="#EBF1FF" mb={4}>Bookings</Heading>
          <TableContainer bg="#0F0F2A" borderRadius="lg">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th color="gray.400">Reference</Th>
                  <Th color="gray.400">Status</Th>
                  <Th color="gray.400">Pickup</Th>
                  <Th color="gray.400">Scheduled</Th>
                  <Th color="gray.400">Quote</Th>
                  <Th color="gray.400"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} color="gray.500">No bookings.</Td>
                  </Tr>
                ) : (
                  bookings.map((b) => (
                    <Tr key={b.id}>
                      <Td fontFamily="monospace" color="#EBF1FF">{b.referenceNumber ?? b.id.slice(0, 8)}</Td>
                      <Td><Badge colorScheme={b.status === 'cancelled' ? 'red' : 'purple'}>{b.status}</Badge></Td>
                      <Td maxW="180px" isTruncated color="#EBF1FF" title={b.pickupAddress}>{b.pickupAddress}</Td>
                      <Td color="#EBF1FF">{b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : '—'}</Td>
                      <Td color="#EBF1FF">£{b.quotePrice}</Td>
                      <Td>
                        <Link href={`/admin/bookings/${b.id}`}>
                          <Button size="xs" variant="outline" colorScheme="purple">View</Button>
                        </Link>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Container>
  );
}
