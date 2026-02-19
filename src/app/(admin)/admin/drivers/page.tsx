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
  Badge,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';

type DriverRow = {
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
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const toast = useToast();

  const loadDrivers = () => {
    setLoading(true);
    fetch('/api/admin/drivers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.drivers)) {
          setDrivers(data.drivers);
        } else {
          setError('Failed to load drivers');
        }
      })
      .catch(() => setError('Failed to load drivers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleToggleActive = (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setUpdatingId(id);
    fetch(`/api/admin/drivers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newActive }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDrivers((prev) =>
            prev.map((d) =>
              d.id === id ? { ...d, isActive: newActive } : d
            )
          );
          toast({
            title: newActive ? 'Driver approved' : 'Driver suspended',
            status: 'success',
            duration: 3000,
          });
        } else {
          toast({ title: data.error || 'Update failed', status: 'error', duration: 3000 });
        }
      })
      .catch(() => {
        toast({ title: 'Failed to update driver', status: 'error', duration: 3000 });
      })
      .finally(() => setUpdatingId(null));
  };

  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={6} color="#EBF1FF">
        Drivers
      </Heading>

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
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Email</Th>
                <Th color="gray.400">License</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Jobs</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {drivers.length === 0 ? (
                <Tr>
                  <Td colSpan={6} color="gray.500">
                    No drivers found.
                  </Td>
                </Tr>
              ) : (
                drivers.map((d) => (
                  <Tr key={d.id}>
                    <Td color="#EBF1FF" fontWeight="medium">
                      {d.userName ?? '—'}
                    </Td>
                    <Td color="#EBF1FF">{d.userEmail ?? '—'}</Td>
                    <Td fontFamily="monospace" color="#EBF1FF" fontSize="xs">
                      {d.licenseNumber}
                    </Td>
                    <Td>
                      <Badge colorScheme={d.isActive ? 'green' : 'red'}>
                        {d.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </Td>
                    <Td color="#EBF1FF">{d.completedJobs ?? 0}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Link href={`/admin/drivers/${d.id}`}>
                          <Button size="xs" variant="outline" colorScheme="purple">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="xs"
                          colorScheme={d.isActive ? 'red' : 'green'}
                          variant="outline"
                          isLoading={updatingId === d.id}
                          onClick={() => handleToggleActive(d.id, !!d.isActive)}
                        >
                          {d.isActive ? 'Suspend' : 'Approve'}
                        </Button>
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
