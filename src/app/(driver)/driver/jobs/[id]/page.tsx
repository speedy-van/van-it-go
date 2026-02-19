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

type Job = {
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

export default function DriverJobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setJob(data.booking);
        } else {
          setError('Job not found');
        }
      })
      .catch(() => setError('Failed to load job'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxW="2xl" py={8}>
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxW="2xl" py={8}>
        <Text color="red">{error ?? 'Job not found'}</Text>
        <Link href="/driver/jobs">
          <Button mt={4}>Back to jobs</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Job detail</Heading>
        <Link href="/driver/jobs">
          <Button variant="outline" size="sm">
            Back to jobs
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
            {job.referenceNumber}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Status</Text>
          <Badge>{job.status}</Badge>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Pickup</Text>
          <Text>{job.pickupAddress}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Dropoff</Text>
          <Text>{job.dropoffAddress}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Scheduled</Text>
          <Text>
            {job.scheduledAt
              ? new Date(job.scheduledAt).toLocaleString()
              : '—'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Quote</Text>
          <Text>£{job.quotePrice}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">Service type</Text>
          <Text>{job.serviceType}</Text>
        </Box>
      </VStack>
    </Container>
  );
}
