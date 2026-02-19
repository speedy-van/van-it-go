'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  RadioGroup,
  Radio,
  Stack,
  Spinner,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import type { BookingData } from './BookingWizard';

interface DriverOption {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  estimatedArrival?: string;
}

interface StepDriverSelectProps {
  data: BookingData;
  onDataChange: (data: Partial<BookingData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function StepDriverSelect({
  data,
  onDataChange,
  onNext,
  isLoading,
}: StepDriverSelectProps) {
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>(data.driverId ?? '');
  const [fetching, setFetching] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    fetch('/api/drivers')
      .then((res) => res.json())
      .then((result) => {
        const list = Array.isArray(result)
          ? result
          : (result?.drivers && Array.isArray(result.drivers)
            ? result.drivers
            : []);
        setDrivers(list);
        if (list.length > 0 && !selectedId) {
          const first = list[0] as { id?: string };
          if (first?.id) setSelectedId(first.id);
        }
      })
      .catch(() => setDrivers([]))
      .finally(() => setFetching(false));
  // Intentionally run only on mount; selectedId omitted to avoid re-fetch on selection change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    onDataChange({ driverId: selectedId || undefined });
    onNext();
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="lg" fontWeight="bold">
        Choose your driver (optional)
      </Text>
      <Text fontSize="sm" color="#EBF1FF">
        We can assign a driver automatically, or you can pick one below.
      </Text>

      {fetching ? (
        <Stack direction="row" align="center" spacing={3} py={6}>
          <Spinner size="sm" color="#7B2FFF" />
          <Text>Loading available drivers...</Text>
        </Stack>
      ) : drivers.length === 0 ? (
        <Box
          p={6}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <Text>
            No drivers available for your area yet. We will assign one
            automatically after you confirm your booking.
          </Text>
          <Button
            mt={4}
            bg="#FFB800"
            color="#06061A"
            onClick={handleNext}
            isDisabled={isLoading}
            _hover={{ bg: '#E6A500' }}
          >
            Continue with automatic assignment
          </Button>
        </Box>
      ) : (
        <>
          <RadioGroup
            value={selectedId}
            onChange={setSelectedId}
            aria-label="Select driver"
          >
            <Stack spacing={4}>
              {drivers.map((driver) => (
                <Box
                  key={driver.id}
                  p={4}
                  borderWidth="2px"
                  borderColor={
                    selectedId === driver.id
                      ? '#7B2FFF'
                      : 'rgba(123, 47, 255, 0.2)'
                  }
                  borderRadius="8px"
                  cursor="pointer"
                  onClick={() => setSelectedId(driver.id)}
                  transition={prefersReducedMotion ? undefined : 'border-color 0.2s'}
                  _hover={{
                    borderColor: 'rgba(123, 47, 255, 0.5)',
                  }}
                >
                  <Radio value={driver.id} aria-label={`Select ${driver.name}`}>
                    <VStack align="start" ml={4} spacing={0}>
                      <Text fontWeight="bold">{driver.name}</Text>
                      <Text fontSize="sm" color="#EBF1FF">
                        Rating: {driver.rating} · {driver.completedJobs} jobs
                        completed
                      </Text>
                    </VStack>
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>

          <Button
            bg="#FFB800"
            color="#06061A"
            onClick={handleNext}
            isDisabled={isLoading}
            w="full"
            _hover={{ bg: '#E6A500' }}
          >
            Continue
          </Button>
        </>
      )}
    </VStack>
  );
}
