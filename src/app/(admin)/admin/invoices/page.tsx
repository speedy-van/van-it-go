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
} from '@chakra-ui/react';
import Link from 'next/link';

type InvoiceRow = {
  id: string;
  bookingId: string;
  referenceNumber: string | null;
  amount: string;
  status: string;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  serviceType: string;
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadInvoices = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    fetch(`/api/admin/invoices?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
        } else {
          setError('Failed to load invoices');
        }
      })
      .catch(() => setError('Failed to load invoices'))
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={6} color="#EBF1FF">
        Invoices
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
        <Button size="sm" colorScheme="purple" mt={8} onClick={loadInvoices}>
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
                <Th color="gray.400">Invoice / Ref</Th>
                <Th color="gray.400">Customer</Th>
                <Th color="gray.400">Service</Th>
                <Th color="gray.400">Amount</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Date</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.length === 0 ? (
                <Tr>
                  <Td colSpan={7} color="gray.500">
                    No invoices found.
                  </Td>
                </Tr>
              ) : (
                invoices.map((inv) => (
                  <Tr key={inv.id}>
                    <Td fontFamily="monospace" fontWeight="bold" color="#EBF1FF">
                      {inv.referenceNumber ?? inv.id.slice(0, 8)}
                    </Td>
                    <Td color="#EBF1FF">{inv.customerName ?? inv.customerEmail ?? '—'}</Td>
                    <Td color="#EBF1FF">{inv.serviceType}</Td>
                    <Td color="#EBF1FF">£{inv.amount}</Td>
                    <Td>
                      <Badge colorScheme={inv.status === 'completed' ? 'green' : 'yellow'}>
                        {inv.status}
                      </Badge>
                    </Td>
                    <Td color="#EBF1FF">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                    </Td>
                    <Td>
                      <Link href={`/admin/invoices/${inv.id}`}>
                        <Button size="xs" variant="outline" colorScheme="purple">
                          View / Print
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
