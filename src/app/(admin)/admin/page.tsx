'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Link as ChakraLink,
  Button,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import Link from 'next/link';

type Stats = {
  totalBookings: number;
  revenue: number;
  activeDrivers: number;
  suspendedDrivers: number;
};

type BookingRow = {
  id: string;
  referenceNumber: string | null;
  status: string;
  pickupAddress: string;
  scheduledAt: string | null;
  quotePrice: string;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadStats = useCallback(() => {
    const params = new URLSearchParams();
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    fetch(`/api/admin/stats?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {});
  }, [fromDate, toDate]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setRecentBookings(data.bookings.slice(0, 10));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  const applyDateFilter = () => {
    loadStats();
  };

  if (!session) return null;

  return (
    <Container maxW="full" py={0}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={1} color="#EBF1FF">
            Dashboard
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Welcome, {session.user?.name || session.user?.email}
          </Text>
        </Box>

        {/* Date range filter */}
        <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Filter by date range
            </Heading>
            <HStack flexWrap="wrap" gap={4}>
              <FormControl maxW="200px">
                <FormLabel fontSize="sm" color="gray.400">From</FormLabel>
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
                <FormLabel fontSize="sm" color="gray.400">To</FormLabel>
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
              <Button
                size="sm"
                colorScheme="purple"
                mt={8}
                onClick={applyDateFilter}
              >
                Apply
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
            <CardBody>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Total Bookings
              </Text>
              <Heading size="lg" color="#EBF1FF">
                {stats?.totalBookings ?? '—'}
              </Heading>
              <Text fontSize="xs" color="gray.500" mt={2}>
                {fromDate && toDate ? 'In selected range' : 'All time'}
              </Text>
            </CardBody>
          </Card>

          <Card bg="#0F0F2A" borderLeft="4px solid #FFB800">
            <CardBody>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Revenue
              </Text>
              <Heading size="lg" color="#EBF1FF">
                £{stats?.revenue !== undefined && stats.revenue !== null ? Number(stats.revenue).toFixed(2) : '—'}
              </Heading>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Completed payments
              </Text>
            </CardBody>
          </Card>

          <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
            <CardBody>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Active Drivers
              </Text>
              <Heading size="lg" color="#EBF1FF">
                {stats?.activeDrivers ?? '—'}
              </Heading>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Approved & active
              </Text>
            </CardBody>
          </Card>

          <Card bg="#0F0F2A" borderLeft="4px solid #FFB800">
            <CardBody>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Suspended / Pending
              </Text>
              <Heading size="lg" color="#EBF1FF">
                {stats?.suspendedDrivers ?? '—'}
              </Heading>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Inactive or under review
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Recent Bookings */}
        <Box p={6} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color="#EBF1FF">
              Recent Bookings
            </Heading>
            <Link href="/admin/bookings" passHref legacyBehavior>
              <ChakraLink fontSize="sm" color="#B794F6">
                View all →
              </ChakraLink>
            </Link>
          </HStack>
          {loading ? (
            <HStack justify="center" py={8}>
              <Spinner size="lg" color="#7B2FFF" />
            </HStack>
          ) : (
            <TableContainer>
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
                  {recentBookings.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} color="gray.500">
                        No bookings found.
                      </Td>
                    </Tr>
                  ) : (
                    recentBookings.map((b) => (
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
                        <Td color="#EBF1FF">
                          {b.scheduledAt
                            ? new Date(b.scheduledAt).toLocaleString()
                            : '—'}
                        </Td>
                        <Td color="#EBF1FF">£{b.quotePrice}</Td>
                        <Td>
                          <Link href={`/admin/bookings/${b.id}`}>
                            <Button size="xs" variant="outline" colorScheme="purple">
                              View
                            </Button>
                          </Link>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
