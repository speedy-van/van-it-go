'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  List,
  ListItem,
  Text,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import type { BookingData } from './BookingWizard';

interface GeocodeResult {
  address: string;
  text: string;
  latitude: number;
  longitude: number;
}

interface StepAddressesProps {
  data: BookingData;
  onDataChange: (data: Partial<BookingData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function StepAddresses({
  data,
  onDataChange,
  onNext,
  isLoading,
}: StepAddressesProps) {
  const [pickupInput, setPickupInput] = useState(data.pickupAddress || '');
  const [dropoffInput, setDropoffInput] = useState(
    data.dropoffAddress || ''
  );
  const [pickupSuggestions, setPickupSuggestions] = useState<
    GeocodeResult[]
  >([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<
    GeocodeResult[]
  >([]);
  const [moveSize, setMoveSize] = useState(data.moveSize || 'medium');
  const [pickupFloorNumber, setPickupFloorNumber] = useState(
    data.pickupFloorNumber ?? 0
  );
  const [pickupFlatUnit, setPickupFlatUnit] = useState(
    data.pickupFlatUnit || ''
  );
  const [pickupHasLift, setPickupHasLift] = useState(
    data.pickupHasLift ?? false
  );
  const [pickupNotes, setPickupNotes] = useState(data.pickupNotes || '');
  const [dropoffFloorNumber, setDropoffFloorNumber] = useState(
    data.dropoffFloorNumber ?? 0
  );
  const [dropoffFlatUnit, setDropoffFlatUnit] = useState(
    data.dropoffFlatUnit || ''
  );
  const [dropoffHasLift, setDropoffHasLift] = useState(
    data.dropoffHasLift ?? false
  );
  const [dropoffNotes, setDropoffNotes] = useState(data.dropoffNotes || '');

  const handleGeocodeSearch = useCallback(
    async (address: string, isPickup: boolean) => {
      if (address.length < 3) {
        if (isPickup) {
          setPickupSuggestions([]);
        } else {
          setDropoffSuggestions([]);
        }
        return;
      }
      try {
        const response = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, limit: 5 }),
        });

        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        if (isPickup) {
          setPickupSuggestions(data.results || []);
        } else {
          setDropoffSuggestions(data.results || []);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    },
    []
  );

  const handleSelectAddress = (
    result: GeocodeResult,
    isPickup: boolean
  ) => {
    if (isPickup) {
      setPickupInput(result.address);
      setPickupSuggestions([]);
      onDataChange({
        pickupAddress: result.address,
        pickupLat: result.latitude,
        pickupLng: result.longitude,
      });
    } else {
      setDropoffInput(result.address);
      setDropoffSuggestions([]);
      onDataChange({
        dropoffAddress: result.address,
        dropoffLat: result.latitude,
        dropoffLng: result.longitude,
      });
    }
  };

  const isValid =
    data.pickupAddress &&
    data.pickupLat &&
    data.pickupLng &&
    data.dropoffAddress &&
    data.dropoffLat &&
    data.dropoffLng;

  return (
    <VStack spacing={6} align="stretch">
      <Box
        p={3}
        bg="rgba(123, 47, 255, 0.15)"
        borderRadius="8px"
        borderLeft="4px solid #7B2FFF"
      >
        <Text fontSize="sm" color="#EBF1FF">
          Please be advised: Floor number and lift availability affect the price.
        </Text>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Where are you moving from?
        </Text>
        <FormControl position="relative">
          <FormLabel htmlFor="pickup">Pickup Address</FormLabel>
          <Input
            id="pickup"
            placeholder="Enter address..."
            value={pickupInput}
            onChange={(e) => {
              setPickupInput(e.target.value);
              handleGeocodeSearch(e.target.value, true);
            }}
            isDisabled={isLoading}
          />
          {pickupSuggestions.length > 0 && (
            <List
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg="#0F0F2A"
              borderRadius="8px"
              mt={1}
              boxShadow="lg"
              zIndex={10}
            >
              {pickupSuggestions.map((suggestion, idx) => (
                <ListItem
                  key={idx}
                  p={3}
                  borderBottomWidth="1px"
                  borderColor="rgba(123, 47, 255, 0.2)"
                  _last={{ borderBottom: 'none' }}
                  cursor="pointer"
                  _hover={{ bg: 'rgba(123, 47, 255, 0.1)' }}
                  onClick={() => handleSelectAddress(suggestion, true)}
                >
                  <Text fontSize="sm">{suggestion.address}</Text>
                </ListItem>
              ))}
            </List>
          )}
        </FormControl>

        <HStack spacing={4} mt={4} flexWrap="wrap" gap={4}>
          <FormControl w="80px">
            <FormLabel fontSize="sm">Floor number</FormLabel>
            <Input
              type="number"
              min={0}
              value={pickupFloorNumber}
              onChange={(e) =>
                setPickupFloorNumber(parseInt(e.target.value, 10) || 0)
              }
              isDisabled={isLoading}
              placeholder="0"
            />
          </FormControl>
          <FormControl flex={1} minW="120px">
            <FormLabel fontSize="sm">Flat / unit number</FormLabel>
            <Input
              value={pickupFlatUnit}
              onChange={(e) => setPickupFlatUnit(e.target.value)}
              isDisabled={isLoading}
              placeholder="e.g. 12, Flat A"
            />
          </FormControl>
        </HStack>
        <FormControl mt={3}>
          <Checkbox
            isChecked={pickupHasLift}
            onChange={(e) => setPickupHasLift(e.target.checked)}
            isDisabled={isLoading}
          >
            Building has a lift
          </Checkbox>
        </FormControl>
        <FormControl mt={3}>
          <FormLabel fontSize="sm">Pickup notes (optional)</FormLabel>
          <Textarea
            value={pickupNotes}
            onChange={(e) => setPickupNotes(e.target.value)}
            isDisabled={isLoading}
            placeholder="Access details, parking, etc."
            rows={2}
          />
        </FormControl>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Where are you moving to?
        </Text>
        <FormControl position="relative">
          <FormLabel htmlFor="dropoff">Dropoff Address</FormLabel>
          <Input
            id="dropoff"
            placeholder="Enter address..."
            value={dropoffInput}
            onChange={(e) => {
              setDropoffInput(e.target.value);
              handleGeocodeSearch(e.target.value, false);
            }}
            isDisabled={isLoading}
          />
          {dropoffSuggestions.length > 0 && (
            <List
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg="#0F0F2A"
              borderRadius="8px"
              mt={1}
              boxShadow="lg"
              zIndex={10}
            >
              {dropoffSuggestions.map((suggestion, idx) => (
                <ListItem
                  key={idx}
                  p={3}
                  borderBottomWidth="1px"
                  borderColor="rgba(123, 47, 255, 0.2)"
                  _last={{ borderBottom: 'none' }}
                  cursor="pointer"
                  _hover={{ bg: 'rgba(123, 47, 255, 0.1)' }}
                  onClick={() => handleSelectAddress(suggestion, false)}
                >
                  <Text fontSize="sm">{suggestion.address}</Text>
                </ListItem>
              ))}
            </List>
          )}
        </FormControl>

        <HStack spacing={4} mt={4} flexWrap="wrap" gap={4}>
          <FormControl w="80px">
            <FormLabel fontSize="sm">Floor number</FormLabel>
            <Input
              type="number"
              min={0}
              value={dropoffFloorNumber}
              onChange={(e) =>
                setDropoffFloorNumber(parseInt(e.target.value, 10) || 0)
              }
              isDisabled={isLoading}
              placeholder="0"
            />
          </FormControl>
          <FormControl flex={1} minW="120px">
            <FormLabel fontSize="sm">Flat / unit number</FormLabel>
            <Input
              value={dropoffFlatUnit}
              onChange={(e) => setDropoffFlatUnit(e.target.value)}
              isDisabled={isLoading}
              placeholder="e.g. 12, Flat A"
            />
          </FormControl>
        </HStack>
        <FormControl mt={3}>
          <Checkbox
            isChecked={dropoffHasLift}
            onChange={(e) => setDropoffHasLift(e.target.checked)}
            isDisabled={isLoading}
          >
            Building has a lift
          </Checkbox>
        </FormControl>
        <FormControl mt={3}>
          <FormLabel fontSize="sm">Drop off notes (optional)</FormLabel>
          <Textarea
            value={dropoffNotes}
            onChange={(e) => setDropoffNotes(e.target.value)}
            isDisabled={isLoading}
            placeholder="Access details, parking, etc."
            rows={2}
          />
        </FormControl>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          How much are you moving?
        </Text>
        <RadioGroup value={moveSize} onChange={setMoveSize}>
          <Stack spacing={4}>
            <Box
              p={4}
              borderWidth="2px"
              borderColor={
                moveSize === 'small'
                  ? '#7B2FFF'
                  : 'rgba(123, 47, 255, 0.2)'
              }
              borderRadius="8px"
              cursor="pointer"
              onClick={() => setMoveSize('small')}
            >
              <Radio value="small" mr={4}>
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold">Small Move</Text>
                  <Text fontSize="sm" color="#EBF1FF">
                    1-3 items, up to 5m³
                  </Text>
                </VStack>
              </Radio>
            </Box>

            <Box
              p={4}
              borderWidth="2px"
              borderColor={
                moveSize === 'medium'
                  ? '#7B2FFF'
                  : 'rgba(123, 47, 255, 0.2)'
              }
              borderRadius="8px"
              cursor="pointer"
              onClick={() => setMoveSize('medium')}
            >
              <Radio value="medium" mr={4}>
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold">Medium Move</Text>
                  <Text fontSize="sm" color="#EBF1FF">
                    4-8 items, 5-15m³
                  </Text>
                </VStack>
              </Radio>
            </Box>

            <Box
              p={4}
              borderWidth="2px"
              borderColor={
                moveSize === 'large'
                  ? '#7B2FFF'
                  : 'rgba(123, 47, 255, 0.2)'
              }
              borderRadius="8px"
              cursor="pointer"
              onClick={() => setMoveSize('large')}
            >
              <Radio value="large" mr={4}>
                <VStack align="start" ml={4}>
                  <Text fontWeight="bold">Large Move</Text>
                  <Text fontSize="sm" color="#EBF1FF">
                    9+ items, 15m³+
                  </Text>
                </VStack>
              </Radio>
            </Box>
          </Stack>
        </RadioGroup>
      </Box>

      <Button
        bg="#FFB800"
        color="#06061A"
        onClick={() => {
          onDataChange({
            moveSize,
            pickupFloorNumber,
            pickupFlatUnit,
            pickupHasLift,
            pickupNotes,
            dropoffFloorNumber,
            dropoffFlatUnit,
            dropoffHasLift,
            dropoffNotes,
          });
          onNext();
        }}
        isDisabled={!isValid || isLoading}
        isLoading={isLoading}
        w="full"
      >
        Continue
      </Button>
    </VStack>
  );
}
