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

type JobRow = {
  id: string;
  referenceNumber: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: string;
  quotePrice: string;
};

export default function DriverJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In production, driverId comes from session
    const driverId = typeof window !== 'undefined' ? localStorage.getItem('driverId') ?? '' : '';
    if (!driverId) {
      setJobs([]);
      setLoading(false);
      return;
    }
    fetch(`/api/drivers/${driverId}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setError(data.error ?? 'Failed to load jobs');
        }
      })
      .catch(() => setError('Failed to load jobs'))
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
        Available &amp; Accepted Jobs
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
            {jobs.length === 0 ? (
              <Tr>
                <Td colSpan={7}>
                  <Text color="gray.500">
                    {error ?? 'No jobs. Sign in as a driver or wait for assignments.'}
                  </Text>
                </Td>
              </Tr>
            ) : (
              jobs.map((b) => (
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
                    <Link href={`/driver/jobs/${b.id}`}>View</Link>
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
