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
  Divider,
} from '@chakra-ui/react';
import Link from 'next/link';

type Invoice = {
  id: string;
  bookingId: string;
  referenceNumber: string | null;
  amount: string;
  status: string;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  serviceType: string;
  scheduledAt: string | null;
  quotePrice: string | null;
};

const COMPANY_NAME = 'Speedy Van';
const SUPPORT_EMAIL = 'support@speedy-van.co.uk';
const SUPPORT_PHONE = '01202 129746';

export default function AdminInvoiceViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.invoice) {
          setInvoice(data.invoice);
        } else {
          setError('Invoice not found');
        }
      })
      .catch(() => setError('Failed to load invoice'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
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

  if (error || !invoice) {
    return (
      <Container maxW="2xl" py={8}>
        <Text color="red.400">{error ?? 'Invoice not found'}</Text>
        <Link href="/admin/invoices">
          <Button mt={4} size="sm">Back to invoices</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <HStack justify="space-between" mb={6} sx={{ '@media print': { display: 'none' } }}>
        <Link href="/admin/invoices">
          <Button variant="outline" size="sm" colorScheme="purple">Back to list</Button>
        </Link>
        <Button size="sm" colorScheme="purple" onClick={handlePrint}>
          Print invoice
        </Button>
      </HStack>

      <Box
        bg="white"
        color="gray.800"
        p={8}
        borderRadius="lg"
        id="invoice-content"
      >
        <HStack justify="space-between" align="flex-start" mb={6}>
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="gray.800">{COMPANY_NAME}</Heading>
            <Text fontSize="sm" color="gray.600">{SUPPORT_EMAIL}</Text>
            <Text fontSize="sm" color="gray.600">{SUPPORT_PHONE}</Text>
          </VStack>
          <VStack align="end" spacing={0}>
            <Text fontWeight="bold" fontSize="lg">INVOICE</Text>
            <Text fontFamily="monospace">{invoice.referenceNumber ?? invoice.id.slice(0, 8)}</Text>
            <Text fontSize="sm" color="gray.600">
              {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : '—'}
            </Text>
          </VStack>
        </HStack>

        <Divider borderColor="gray.300" my={4} />

        <VStack align="stretch" spacing={2} mb={6}>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">Bill to</Text>
          <Text fontWeight="bold">{invoice.customerName ?? '—'}</Text>
          <Text fontSize="sm">{invoice.customerEmail ?? '—'}</Text>
        </VStack>

        <Box mb={6}>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={2}>Booking details</Text>
          <Box fontSize="sm">
            <Text><strong>Service:</strong> {invoice.serviceType}</Text>
            <Text><strong>Pickup:</strong> {invoice.pickupAddress}</Text>
            <Text><strong>Dropoff:</strong> {invoice.dropoffAddress}</Text>
            <Text><strong>Scheduled:</strong> {invoice.scheduledAt ? new Date(invoice.scheduledAt).toLocaleString() : '—'}</Text>
          </Box>
        </Box>

        <Divider borderColor="gray.300" my={4} />

        <HStack justify="flex-end" mt={6}>
          <Box textAlign="right">
            <Text fontSize="sm" color="gray.600">Total amount</Text>
            <Heading size="lg">£{invoice.amount}</Heading>
            <Text fontSize="xs" color="gray.500">Status: {invoice.status}</Text>
          </Box>
        </HStack>

        <Divider borderColor="gray.300" my={6} />

        <Text fontSize="xs" color="gray.500" textAlign="center">
          Thank you for your business. For support contact {SUPPORT_EMAIL} or {SUPPORT_PHONE}.
        </Text>
      </Box>
    </Container>
  );
}
