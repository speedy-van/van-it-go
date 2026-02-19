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
  Button,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';

type CustomerRow = {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean | null;
  createdAt: string | null;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          setError('Failed to load customers');
        }
      })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={6} color="#EBF1FF">
        Customers
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
                <Th color="gray.400">Verified</Th>
                <Th color="gray.400">Joined</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.length === 0 ? (
                <Tr>
                  <Td colSpan={5} color="gray.500">
                    No customers found.
                  </Td>
                </Tr>
              ) : (
                customers.map((c) => (
                  <Tr key={c.id}>
                    <Td color="#EBF1FF" fontWeight="medium">{c.name ?? '—'}</Td>
                    <Td color="#EBF1FF">{c.email ?? '—'}</Td>
                    <Td color="#EBF1FF">{c.emailVerified ? 'Yes' : 'No'}</Td>
                    <Td color="#EBF1FF">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </Td>
                    <Td>
                      <Link href={`/admin/customers/${c.id}`}>
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
    </Container>
  );
}
