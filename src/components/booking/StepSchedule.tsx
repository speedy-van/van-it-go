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
  Checkbox,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { BookingData } from './BookingWizard';

interface StepScheduleProps {
  data: BookingData;
  onDataChange: (data: Partial<BookingData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function StepSchedule({
  data,
  onDataChange,
  onNext,
  isLoading,
}: StepScheduleProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [scheduledAt, setScheduledAt] = useState(
    data.scheduledAt
      ? data.scheduledAt.toISOString().split('T')[0]
      : tomorrow.toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [requireHelper, setRequireHelper] = useState(
    data.options?.requireHelper || false
  );
  const [insuranceNeeded, setInsuranceNeeded] = useState(
    data.options?.insuranceNeeded || false
  );
  const [carbonOffset, setCarbonOffset] = useState(
    data.options?.carbonOffset || false
  );

  const handleContinue = () => {
    const dateTime = new Date(`${scheduledAt}T${scheduledTime}`);
    onDataChange({
      scheduledAt: dateTime,
      options: {
        requireHelper,
        insuranceNeeded,
        carbonOffset,
      },
    });
    onNext();
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <FormControl>
          <FormLabel htmlFor="date">Preferred Moving Date</FormLabel>
          <Input
            id="date"
            type="date"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={tomorrow.toISOString().split('T')[0]}
            isDisabled={isLoading}
          />
          <Text fontSize="xs" color="#EBF1FF" mt={2}>
            Bookings must be at least 24 hours in advance
          </Text>
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel htmlFor="time">Preferred Time</FormLabel>
          <Input
            id="time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            isDisabled={isLoading}
          />
          <Text fontSize="xs" color="#EBF1FF" mt={2}>
            We&apos;ll contact you to confirm the exact time
          </Text>
        </FormControl>
      </Box>

      <Box pt={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Add-ons & Options
        </Text>
        <Stack spacing={4}>
          <Box
            p={4}
            borderWidth="1px"
            borderColor="rgba(123, 47, 255, 0.3)"
            borderRadius="8px"
            cursor="pointer"
            _hover={{ bg: 'rgba(123, 47, 255, 0.05)' }}
            onClick={() => setRequireHelper(!requireHelper)}
          >
            <HStack>
              <Checkbox
                isChecked={requireHelper}
                onChange={(e) =>
                  setRequireHelper(e.target.checked)
                }
                colorScheme="purple"
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">Extra Helper</Text>
                <Text fontSize="sm" color="#EBF1FF">
                  Add a second person to help with your move (+£50)
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box
            p={4}
            borderWidth="1px"
            borderColor="rgba(123, 47, 255, 0.3)"
            borderRadius="8px"
            cursor="pointer"
            _hover={{ bg: 'rgba(123, 47, 255, 0.05)' }}
            onClick={() => setInsuranceNeeded(!insuranceNeeded)}
          >
            <HStack>
              <Checkbox
                isChecked={insuranceNeeded}
                onChange={(e) =>
                  setInsuranceNeeded(e.target.checked)
                }
                colorScheme="purple"
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">Moving Insurance</Text>
                <Text fontSize="sm" color="#EBF1FF">
                  Protect your items with our
                  comprehensive coverage (£15)
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box
            p={4}
            borderWidth="1px"
            borderColor="rgba(123, 47, 255, 0.3)"
            borderRadius="8px"
            cursor="pointer"
            _hover={{ bg: 'rgba(123, 47, 255, 0.05)' }}
            onClick={() => setCarbonOffset(!carbonOffset)}
          >
            <HStack>
              <Checkbox
                isChecked={carbonOffset}
                onChange={(e) =>
                  setCarbonOffset(e.target.checked)
                }
                colorScheme="purple"
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">Carbon Offset</Text>
                <Text fontSize="sm" color="#EBF1FF">
                  Offset your move&apos;s carbon footprint via Ecologi
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Stack>
      </Box>

      <Button
        bg="#FFB800"
        color="#06061A"
        onClick={handleContinue}
        isDisabled={isLoading}
        isLoading={isLoading}
        w="full"
      >
        Continue
      </Button>
    </VStack>
  );
}
