'use client';

import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Divider,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import type { BookingData, QuoteData } from './BookingWizard';

interface StepReviewProps {
  data: BookingData;
  quote: QuoteData | null;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
}

function calculateAddOnsCost(data: BookingData): {
  helperFee: number;
  insuranceFee: number;
  carbonOffsetFee: number;
  total: number;
} {
  return {
    helperFee: data.options?.requireHelper ? 50 : 0,
    insuranceFee: data.options?.insuranceNeeded ? 15 : 0,
    carbonOffsetFee: data.options?.carbonOffset ? 5 : 0,
    total:
      (data.options?.requireHelper ? 50 : 0) +
      (data.options?.insuranceNeeded ? 15 : 0) +
      (data.options?.carbonOffset ? 5 : 0),
  };
}

export function StepReview({
  data,
  quote,
  onNext,
  onPrevious,
  isLoading,
}: StepReviewProps) {
  const addOns = calculateAddOnsCost(data);
  const subtotal = quote?.totalPrice || 0;
  const total = subtotal + addOns.total;

  const formattedDate = data.scheduledAt
    ? data.scheduledAt.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not set';

  const formattedTime = data.scheduledAt
    ? data.scheduledAt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Not set';

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>
          Review Your Booking
        </Heading>
        <Text color="#EBF1FF" fontSize="sm">
          Please verify all details before proceeding to payment
        </Text>
      </Box>

      {/* Pickup Details */}
      <Box p={5} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Heading size="sm" mb={4} color="#FFB800">
          📍 Pickup Location
        </Heading>
        <VStack align="start" spacing={3} fontSize="sm">
          <Box>
            <Text color="#EBF1FF" fontWeight="bold">
              {data.pickupAddress}
            </Text>
            {data.pickupFlatUnit && (
              <Text color="#EBF1FF" fontSize="xs">
                Flat/Unit: {data.pickupFlatUnit}
              </Text>
            )}
            {data.pickupFloorNumber !== undefined && data.pickupFloorNumber > 0 && (
              <Text color="#EBF1FF" fontSize="xs">
                Floor: {data.pickupFloorNumber}
                {data.pickupHasLift ? ' (with lift)' : ' (no lift)'}
              </Text>
            )}
          </Box>
          {data.pickupNotes && (
            <Box p={2} bg="#1a1a3f" borderRadius="5px" w="full">
              <Text color="#EBF1FF" fontSize="xs">
                <strong>Notes:</strong> {data.pickupNotes}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Dropoff Details */}
      <Box p={5} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Heading size="sm" mb={4} color="#FFB800">
          📍 Dropoff Location
        </Heading>
        <VStack align="start" spacing={3} fontSize="sm">
          <Box>
            <Text color="#EBF1FF" fontWeight="bold">
              {data.dropoffAddress}
            </Text>
            {data.dropoffFlatUnit && (
              <Text color="#EBF1FF" fontSize="xs">
                Flat/Unit: {data.dropoffFlatUnit}
              </Text>
            )}
            {data.dropoffFloorNumber !== undefined && data.dropoffFloorNumber > 0 && (
              <Text color="#EBF1FF" fontSize="xs">
                Floor: {data.dropoffFloorNumber}
                {data.dropoffHasLift ? ' (with lift)' : ' (no lift)'}
              </Text>
            )}
          </Box>
          {data.dropoffNotes && (
            <Box p={2} bg="#1a1a3f" borderRadius="5px" w="full">
              <Text color="#EBF1FF" fontSize="xs">
                <strong>Notes:</strong> {data.dropoffNotes}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Items & Volume */}
      <Box p={5} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Heading size="sm" mb={4} color="#FFB800">
          📦 Items & Volume
        </Heading>
        <SimpleGrid columns={2} spacing={4} fontSize="sm">
          <Box>
            <Text color="#EBF1FF" fontSize="xs">
              Volume
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {data.volumeCubicMeters?.toFixed(2)} m³
            </Text>
          </Box>
          <Box>
            <Text color="#EBF1FF" fontSize="xs">
              Item Count
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {data.itemCount}
            </Text>
          </Box>
          <Box gridColumn="1 / -1">
            <Text color="#EBF1FF" fontSize="xs">
              Service Type
            </Text>
            <Badge colorScheme="purple" mt={1}>
              {data.serviceType}
            </Badge>
          </Box>
        </SimpleGrid>
        {data.notes && (
          <Box p={2} bg="#1a1a3f" borderRadius="5px" mt={4}>
            <Text color="#EBF1FF" fontSize="xs">
              <strong>Additional notes:</strong> {data.notes}
            </Text>
          </Box>
        )}
      </Box>

      {/* Schedule */}
      <Box p={5} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Heading size="sm" mb={4} color="#FFB800">
          📅 Schedule
        </Heading>
        <SimpleGrid columns={2} spacing={4} fontSize="sm">
          <Box>
            <Text color="#EBF1FF" fontSize="xs">
              Date
            </Text>
            <Text fontWeight="bold">{formattedDate}</Text>
          </Box>
          <Box>
            <Text color="#EBF1FF" fontSize="xs">
              Time
            </Text>
            <Text fontWeight="bold">{formattedTime}</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Add-ons */}
      <Box p={5} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Heading size="sm" mb={4} color="#FFB800">
          ✨ Add-ons & Options
        </Heading>
        <VStack align="start" spacing={2} fontSize="sm">
          {data.options?.requireHelper ? (
            <HStack justify="space-between" w="full">
              <HStack>
                <CheckCircleIcon color="#7B2FFF" />
                <Text>Extra Helper</Text>
              </HStack>
              <Text>+£50.00</Text>
            </HStack>
          ) : (
            <HStack justify="space-between" w="full" opacity={0.5}>
              <Text>Extra Helper</Text>
              <Text>-</Text>
            </HStack>
          )}

          {data.options?.insuranceNeeded ? (
            <HStack justify="space-between" w="full">
              <HStack>
                <CheckCircleIcon color="#7B2FFF" />
                <Text>Moving Insurance</Text>
              </HStack>
              <Text>+£15.00</Text>
            </HStack>
          ) : (
            <HStack justify="space-between" w="full" opacity={0.5}>
              <Text>Moving Insurance</Text>
              <Text>-</Text>
            </HStack>
          )}

          {data.options?.carbonOffset ? (
            <HStack justify="space-between" w="full">
              <HStack>
                <CheckCircleIcon color="#7B2FFF" />
                <Text>Carbon Offset (via Ecologi)</Text>
              </HStack>
              <Text>+£5.00</Text>
            </HStack>
          ) : (
            <HStack justify="space-between" w="full" opacity={0.5}>
              <Text>Carbon Offset</Text>
              <Text>-</Text>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Pricing Breakdown */}
      <Box p={6} bg="#1a1a3f" borderRadius="10px" borderLeft="4px solid #FFB800">
        <Heading size="sm" mb={4} color="#FFB800">
          💷 Pricing Breakdown
        </Heading>
        <VStack align="stretch" spacing={2} fontSize="sm">
          {quote && (
            <>
              <HStack justify="space-between">
                <Text>Base Price</Text>
                <Text>£{quote.basePrice.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Distance ({quote.distanceKm.toFixed(1)} km)</Text>
                <Text>£{quote.distancePrice.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Volume ({data.volumeCubicMeters?.toFixed(2)} m³)</Text>
                <Text>£{quote.volumePrice.toFixed(2)}</Text>
              </HStack>

              {addOns.helperFee > 0 && (
                <HStack justify="space-between" color="#FFB800">
                  <Text>Extra Helper</Text>
                  <Text>+£{addOns.helperFee.toFixed(2)}</Text>
                </HStack>
              )}

              {addOns.insuranceFee > 0 && (
                <HStack justify="space-between" color="#FFB800">
                  <Text>Moving Insurance</Text>
                  <Text>+£{addOns.insuranceFee.toFixed(2)}</Text>
                </HStack>
              )}

              {addOns.carbonOffsetFee > 0 && (
                <HStack justify="space-between" color="#FFB800">
                  <Text>Carbon Offset</Text>
                  <Text>+£{addOns.carbonOffsetFee.toFixed(2)}</Text>
                </HStack>
              )}

              <Divider my={2} />

              <HStack justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total Amount</Text>
                <Text color="#FFB800">£{total.toFixed(2)}</Text>
              </HStack>
            </>
          )}

          {!quote && (
            <Box p={3} bg="#0F0F2A" borderRadius="5px" borderLeft="2px solid #FFB800">
              <HStack>
                <WarningIcon color="#FFB800" />
                <Text fontSize="xs">Quote not available yet</Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Navigation */}
      <HStack spacing={4} justify="space-between" w="full" pt={6}>
        <Button
          variant="outline"
          onClick={onPrevious}
          isDisabled={isLoading}
          color="#7B2FFF"
        >
          ← Previous
        </Button>
        <Button
          bg="#FFB800"
          color="#06061A"
          onClick={onNext}
          isDisabled={isLoading || !quote}
          _hover={{ bg: '#E6A500' }}
          fontWeight="bold"
        >
          Continue to Payment →
        </Button>
      </HStack>
    </VStack>
  );
}
