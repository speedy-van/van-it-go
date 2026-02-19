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

type Driver = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  licenseNumber: string;
  licenseExpiry: string | null;
  insuranceExpiry: string | null;
  rating: string | null;
  completedJobs: number | null;
  isActive: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function AdminDriverDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/drivers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.driver) {
          setDriver(data.driver);
        } else {
          setError('Driver not found');
        }
      })
      .catch(() => setError('Failed to load driver'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleActive = () => {
    if (!driver) return;
    const newActive = !driver.isActive;
    setUpdating(true);
    fetch(`/api/admin/drivers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newActive }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDriver((prev) => (prev ? { ...prev, isActive: newActive } : null));
          toast({
            title: newActive ? 'Driver approved' : 'Driver suspended',
            status: 'success',
            duration: 3000,
          });
        } else {
          toast({ title: data.error || 'Update failed', status: 'error', duration: 3000 });
        }
      })
      .catch(() => toast({ title: 'Failed to update driver', status: 'error', duration: 3000 }))
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <Container maxW="2xl" py={8}>
        <HStack justify="center">
          <Spinner size="lg" color="#7B2FFF" />
        </HStack>
      </Container>
    );
  }

  if (error || !driver) {
    return (
      <Container maxW="2xl" py={8}>
        <Text color="red.400">{error ?? 'Driver not found'}</Text>
        <Link href="/admin/drivers">
          <Button mt={4} size="sm">Back to drivers</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="#EBF1FF">Driver detail</Heading>
        <Link href="/admin/drivers">
          <Button variant="outline" size="sm" colorScheme="purple">Back to list</Button>
        </Link>
      </HStack>
      <VStack align="stretch" spacing={4}>
        <Box p={4} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
          <Text fontSize="sm" color="gray.400" mb={1}>Name</Text>
          <Text fontSize="xl" fontWeight="bold" color="#EBF1FF">{driver.userName ?? '—'}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">Email</Text>
          <Text color="#EBF1FF">{driver.userEmail ?? '—'}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">Status</Text>
          <Badge colorScheme={driver.isActive ? 'green' : 'red'}>
            {driver.isActive ? 'Active' : 'Suspended'}
          </Badge>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">License number</Text>
          <Text fontFamily="monospace" color="#EBF1FF">{driver.licenseNumber}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">License expiry</Text>
          <Text color="#EBF1FF">
            {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : '—'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">Insurance expiry</Text>
          <Text color="#EBF1FF">
            {driver.insuranceExpiry ? new Date(driver.insuranceExpiry).toLocaleDateString() : '—'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">Completed jobs</Text>
          <Text color="#EBF1FF">{driver.completedJobs ?? 0}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400">Rating</Text>
          <Text color="#EBF1FF">{driver.rating ?? '—'}</Text>
        </Box>
        <HStack pt={4}>
          <Button
            colorScheme={driver.isActive ? 'red' : 'green'}
            variant="outline"
            size="sm"
            isLoading={updating}
            onClick={handleToggleActive}
          >
            {driver.isActive ? 'Suspend driver' : 'Approve driver'}
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}
