'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Checkbox,
  Grid,
} from '@chakra-ui/react';
import type { BookingData, QuoteData } from './BookingWizard';

interface StepPaymentProps {
  quote: QuoteData | null;
  bookingData: BookingData;
  onConfirm: () => void;
  isLoading: boolean;
}

function calculateTotal(quote: QuoteData | null, bookingData: BookingData): number {
  const baseTotal = quote?.totalPrice || 0;
  const addOns =
    (bookingData.options?.requireHelper ? 50 : 0) +
    (bookingData.options?.insuranceNeeded ? 15 : 0) +
    (bookingData.options?.carbonOffset ? 5 : 0);
  return baseTotal + addOns;
}

export function StepPayment({
  quote,
  bookingData,
  isLoading,
  ..._rest
}: StepPaymentProps) {
  void _rest; // onConfirm accepted from parent but not used in this step
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = calculateTotal(quote, bookingData);

  const handleContinueToStripe = async () => {
    if (!email?.trim() || !phone?.trim()) {
      setError('Please enter your email and phone number');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          pickupAddress: bookingData.pickupAddress,
          pickupLat: bookingData.pickupLat,
          pickupLng: bookingData.pickupLng,
          dropoffAddress: bookingData.dropoffAddress,
          dropoffLat: bookingData.dropoffLat,
          dropoffLng: bookingData.dropoffLng,
          itemCount: bookingData.itemCount,
          volumeCubicMeters: bookingData.volumeCubicMeters,
          serviceType: bookingData.serviceType,
          scheduledDate: bookingData.scheduledAt?.toISOString(),
          notes: bookingData.notes,
          pickupFloorNumber: bookingData.pickupFloorNumber,
          pickupFlatUnit: bookingData.pickupFlatUnit || undefined,
          pickupHasLift: bookingData.pickupHasLift,
          pickupNotes: bookingData.pickupNotes || undefined,
          dropoffFloorNumber: bookingData.dropoffFloorNumber,
          dropoffFlatUnit: bookingData.dropoffFlatUnit || undefined,
          dropoffHasLift: bookingData.dropoffHasLift,
          dropoffNotes: bookingData.dropoffNotes || undefined,
          hasCustomizedItems: bookingData.hasCustomizedItems,
          email,
          phone,
          quotePrice: quote?.totalPrice || 0,
          distanceKm: quote?.distanceKm || 0,
          estimatedDuration: quote?.estimatedDuration || 0,
          requireHelper: bookingData.options?.requireHelper || false,
          insuranceNeeded: bookingData.options?.insuranceNeeded || false,
          carbonOffset: bookingData.options?.carbonOffset || false,
        }),
      });

      if (!bookingResponse.ok) {
        const err = await bookingResponse.json();
        throw new Error(err.error || 'Failed to create booking');
      }

      const { bookingId, referenceNumber, customerId: resolvedCustomerId } =
        await bookingResponse.json();

      const checkoutResponse = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          bookingId,
          referenceNumber,
          bookingData: {
            email,
            phone,
            pickupAddress: bookingData.pickupAddress ?? '',
            dropoffAddress: bookingData.dropoffAddress ?? '',
          },
        }),
      });

      if (!checkoutResponse.ok) {
        const err = await checkoutResponse.json();
        throw new Error(err.error || 'Could not start secure payment');
      }

      const { redirectUrl } = await checkoutResponse.json();
      if (redirectUrl) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('customerId', resolvedCustomerId ?? customerId);
        }
        window.location.href = redirectUrl;
        return;
      }

      throw new Error('No payment link received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="md">Payment</Heading>

      <Box
        p={6}
        bg="#0F0F2A"
        borderRadius="10px"
        borderLeft="4px solid #7B2FFF"
      >
        <Text fontWeight="bold" mb={4}>
          Order Summary
        </Text>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text>Service Quote</Text>
            <Text fontWeight="bold">
              £{(quote?.totalPrice || 0).toFixed(2)}
            </Text>
          </HStack>
          {bookingData.options?.requireHelper && (
            <HStack justify="space-between">
              <Text>Extra Helper</Text>
              <Text>£50.00</Text>
            </HStack>
          )}
          {bookingData.options?.insuranceNeeded && (
            <HStack justify="space-between">
              <Text>Moving Insurance</Text>
              <Text>£15.00</Text>
            </HStack>
          )}
          {bookingData.options?.carbonOffset && (
            <HStack justify="space-between">
              <Text>Carbon Offset</Text>
              <Text>£5.00</Text>
            </HStack>
          )}
          <Divider />
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg">Total</Text>
            <Text fontWeight="bold" fontSize="lg" color="#FFB800">
              £{total.toFixed(2)}
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={4}>Contact details</Heading>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={isProcessing}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              placeholder="+44 (0)..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isDisabled={isProcessing}
            />
          </FormControl>
        </Grid>
      </Box>

      <Box p={4} bg="rgba(123, 47, 255, 0.1)" borderRadius="8px">
        <HStack spacing={3} align="flex-start">
          <Checkbox
            isChecked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            isDisabled={isProcessing}
            mt={1}
          />
          <Text fontSize="sm">
            I agree to the Terms of Service and Privacy Policy and authorise the payment of{' '}
            <Box as="span" fontWeight="bold" color="#FFB800">£{total.toFixed(2)}</Box>
            {' '}to VanItGo Ltd.
          </Text>
        </HStack>
      </Box>

      {error && (
        <Box p={4} bg="red.600" color="white" borderRadius="8px">
          <Text fontSize="sm">{error}</Text>
        </Box>
      )}

      <Button
        bg="#FFB800"
        color="#06061A"
        width="full"
        size="lg"
        onClick={handleContinueToStripe}
        isLoading={isProcessing}
        isDisabled={isProcessing || isLoading || !email?.trim() || !phone?.trim() || !agreed}
        fontWeight="bold"
      >
        {isProcessing ? 'Taking you to secure payment…' : `Pay £${total.toFixed(2)} with Stripe`}
      </Button>

      <Text fontSize="xs" color="#EBF1FF" textAlign="center">
        You will be redirected to Stripe to enter your card details securely. We never see or store your card number.
      </Text>
    </VStack>
  );
}
