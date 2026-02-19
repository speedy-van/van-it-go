'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Progress,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { StepAddresses } from './StepAddresses';
import { StepItems } from './StepItems';
import { StepSchedule } from './StepSchedule';
import { StepDriverSelect } from './StepDriverSelect';
import { StepReview } from './StepReview';
import { StepPayment } from './StepPayment';
import { StepConfirmation } from './StepConfirmation';

export interface BookingData {
  // Step 1: Addresses
  pickupAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  pickupFloorNumber?: number;
  pickupFlatUnit?: string;
  pickupHasLift?: boolean;
  pickupNotes?: string;
  dropoffAddress?: string;
  dropoffLat?: number;
  dropoffLng?: number;
  dropoffFloorNumber?: number;
  dropoffFlatUnit?: string;
  dropoffHasLift?: boolean;
  dropoffNotes?: string;
  moveSize?: string; // 'small' | 'medium' | 'large'

  // Step 2: Items
  volumeCubicMeters?: number;
  itemCount: number;
  serviceType?: string;
  notes?: string;
  photos?: string[];
  /** Items selected from UK Removal catalog */
  selectedItems?: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    volumeM3: number;
    weightKg: number;
  }>;
  /** True if any selected item has custom/special handling */
  hasCustomizedItems?: boolean;

  // Step 3: Schedule
  scheduledAt?: Date;
  options?: {
    requireHelper?: boolean;
    insuranceNeeded?: boolean;
    carbonOffset?: boolean;
  };

  // Step 4: Driver (optional for MVP)
  driverId?: string;

  // Step 5: Payment
  quotePrice?: number;
  priceLocked?: boolean;
  priceLockFee?: number;
  paymentMethod?: string;

  // Booking confirmation
  bookingId?: string;
  referenceNumber?: string;
}

export interface QuoteData {
  distanceKm: number;
  estimatedDuration: number;
  basePrice: number;
  distancePrice: number;
  volumePrice: number;
  totalPrice: number;
  currency: string;
}

const steps = [
  { number: 1, title: 'Addresses & Size' },
  { number: 2, title: 'Items & Details' },
  { number: 3, title: 'Schedule' },
  { number: 4, title: 'Driver' },
  { number: 5, title: 'Review' },
  { number: 6, title: 'Payment' },
  { number: 7, title: 'Confirmation' },
];

const MILES_TO_KM = 1.60934;

export function BookingWizard() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quoteId');

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    itemCount: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);

  const handleStepChange = useCallback((data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  }, []);

  // Prefill from homepage quote widget (e.g. /book?quoteId=xxx)
  useEffect(() => {
    if (!quoteId) return;
    let cancelled = false;
    fetch(`/api/quote/${encodeURIComponent(quoteId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success || !data.quote) return;
        const q = data.quote;
        const distanceKm = (q.distanceMiles ?? 0) * MILES_TO_KM;
        setBookingData((prev) => ({
          ...prev,
          pickupAddress: q.fromAddress ?? q.fromPostcode,
          pickupLat: q.pickupLat,
          pickupLng: q.pickupLng,
          dropoffAddress: q.toAddress ?? q.toPostcode,
          dropoffLat: q.dropoffLat,
          dropoffLng: q.dropoffLng,
          moveSize: q.moveSize ?? 'medium',
          volumeCubicMeters: q.volumeCubicMeters ?? 10,
          serviceType: 'house_move',
          itemCount: 5,
          quotePrice: q.priceGBP,
        }));
        setQuote({
          distanceKm,
          estimatedDuration: q.etaMinutes ?? 0,
          basePrice: 0,
          distancePrice: 0,
          volumePrice: 0,
          totalPrice: q.priceGBP ?? 0,
          currency: 'GBP',
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  // Fetch quote when we have addresses + volume + service type (after step 2)
  useEffect(() => {
    const hasAddresses =
      bookingData.pickupLat !== null &&
      bookingData.pickupLng !== null &&
      bookingData.dropoffLat !== null &&
      bookingData.dropoffLng !== null;
    const hasItems =
      (bookingData.volumeCubicMeters ?? 0) > 0 &&
      (bookingData.serviceType?.length ?? 0) > 0 &&
      (bookingData.itemCount ?? 0) >= 1;

    if (!hasAddresses || !hasItems || currentStep < 5) {
      return;
    }

    let cancelled = false;
    setError(null);
    setIsLoading(true);

    fetch('/api/pricing/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickupLat: bookingData.pickupLat,
        pickupLng: bookingData.pickupLng,
        dropoffLat: bookingData.dropoffLat,
        dropoffLng: bookingData.dropoffLng,
        volumeCubicMeters: bookingData.volumeCubicMeters ?? 5,
        serviceType: bookingData.serviceType ?? 'house_move',
        itemCount: bookingData.itemCount ?? 1,
        pickupFloorNumber: bookingData.pickupFloorNumber,
        pickupHasLift: bookingData.pickupHasLift,
        dropoffFloorNumber: bookingData.dropoffFloorNumber,
        dropoffHasLift: bookingData.dropoffHasLift,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success || !data.quote) {
          setQuote(null);
          setError(data.error ?? 'Failed to get quote');
          return;
        }
        const q = data.quote;
        setQuote({
          distanceKm: data.distance ?? 0,
          estimatedDuration: q.estimatedDurationMinutes ?? 0,
          basePrice: q.basePrice ?? 0,
          distancePrice: q.distancePrice ?? 0,
          volumePrice: q.volumePrice ?? 0,
          totalPrice: q.totalPrice ?? 0,
          currency: q.currency ?? 'GBP',
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to get quote');
          setQuote(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentStep,
    bookingData.pickupLat,
    bookingData.pickupLng,
    bookingData.dropoffLat,
    bookingData.dropoffLng,
    bookingData.volumeCubicMeters,
    bookingData.serviceType,
    bookingData.itemCount,
    bookingData.pickupFloorNumber,
    bookingData.pickupHasLift,
    bookingData.dropoffFloorNumber,
    bookingData.dropoffHasLift,
  ]);

  const getProgressPercent = () => {
    return (currentStep / steps.length) * 100;
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    // Allow step 6 for confirmation screen after payment
    if (currentStep <= steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepAddresses
            data={bookingData}
            onDataChange={handleStepChange}
            onNext={goToNextStep}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <StepItems
            data={bookingData}
            onDataChange={handleStepChange}
            onNext={goToNextStep}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <StepSchedule
            data={bookingData}
            onDataChange={handleStepChange}
            onNext={goToNextStep}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <StepDriverSelect
            data={bookingData}
            onDataChange={handleStepChange}
            onNext={goToNextStep}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <StepReview
            data={bookingData}
            quote={quote}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            isLoading={isLoading}
          />
        );
      case 6:
        return (
          <StepPayment
            quote={quote}
            bookingData={bookingData}
            onConfirm={goToNextStep}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <StepConfirmation
            bookingId={bookingData.bookingId}
            referenceNumber={bookingData.referenceNumber}
          />
        );
    }
  };

  return (
    <Container maxW="2xl" py={12}>
      <VStack spacing={8}>
        {/* Progress indicator */}
        <Box w="full">
          <HStack mb={4} justify="space-between">
            {steps.map((step) => (
              <Box
                key={step.number}
                textAlign="center"
                opacity={
                  currentStep >= step.number ? 1 : 0.5
                }
              >
                <Box
                  w={10}
                  h={10}
                  bg={
                    currentStep >= step.number
                      ? '#7B2FFF'
                      : '#0F0F2A'
                  }
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={2}
                  fontWeight="bold"
                >
                  {step.number}
                </Box>
                <Box fontSize="xs">{step.title}</Box>
              </Box>
            ))}
          </HStack>
          <Progress value={getProgressPercent()} />
        </Box>

        {/* Error message */}
        {error && (
          <Box
            p={4}
            bg="red"
            color="white"
            borderRadius="8px"
            w="full"
          >
            {error}
          </Box>
        )}

        {/* Current step content */}
        <Box w="full">{renderStep()}</Box>

        {/* Navigation buttons */}
        {currentStep < 7 && currentStep > 1 && (
          <HStack spacing={4} justify="space-between" w="full" pt={8}>
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              isDisabled={currentStep === 1}
            >
              Previous
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
}
