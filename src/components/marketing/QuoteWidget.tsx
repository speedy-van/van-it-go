'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type MoveSize = 'small' | 'medium' | 'large';

interface GeocodeSuggestion {
  address: string;
  text: string;
  latitude: number;
  longitude: number;
  countryCode?: string | null;
}

const GEOCODE_DEBOUNCE_MS = 300;
const MIN_CHARS_FOR_SEARCH = 3;

export function QuoteWidget() {
  const router = useRouter();
  const [fromPostcode, setFromPostcode] = useState('');
  const [toPostcode, setToPostcode] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [moveSize, setMoveSize] = useState<MoveSize>('medium');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fromDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string, isFrom: boolean) => {
    if (query.length < MIN_CHARS_FOR_SEARCH) {
      if (isFrom) setFromSuggestions([]);
      else setToSuggestions([]);
      return;
    }
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: query, limit: 5 }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const list = data.results ?? [];
      if (isFrom) setFromSuggestions(list);
      else setToSuggestions(list);
    } catch {
      if (isFrom) setFromSuggestions([]);
      else setToSuggestions([]);
    }
  }, []);

  const scheduleGeocode = useCallback(
    (value: string, isFrom: boolean) => {
      const ref = isFrom ? fromDebounceRef : toDebounceRef;
      if (ref.current) clearTimeout(ref.current);
      if (value.trim().length < MIN_CHARS_FOR_SEARCH) {
        if (isFrom) setFromSuggestions([]);
        else setToSuggestions([]);
        return;
      }
      ref.current = setTimeout(() => fetchSuggestions(value.trim(), isFrom), GEOCODE_DEBOUNCE_MS);
    },
    [fetchSuggestions]
  );

  const selectFrom = useCallback((suggestion: GeocodeSuggestion) => {
    if (suggestion.countryCode && suggestion.countryCode !== 'GB') {
      toast({
        title: 'UK addresses only',
        description: 'Please select an address in the United Kingdom.',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    setFromPostcode(suggestion.address);
    setFromSuggestions([]);
  }, [toast]);

  const selectTo = useCallback((suggestion: GeocodeSuggestion) => {
    if (suggestion.countryCode && suggestion.countryCode !== 'GB') {
      toast({
        title: 'UK addresses only',
        description: 'Please select an address in the United Kingdom.',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    setToPostcode(suggestion.address);
    setToSuggestions([]);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const from = fromPostcode.trim();
    const to = toPostcode.trim();
    if (!from || !to) {
      toast({ title: 'Please enter both postcodes', status: 'warning', isClosable: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/quote/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPostcode: from,
          toPostcode: to,
          moveSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: data.error ?? 'Could not get quote',
          status: 'error',
          isClosable: true,
        });
        return;
      }
      if (data.success && data.quoteId) {
        toast({
          title: 'Quote ready',
          description: `£${data.priceGBP?.toFixed(2) ?? '0.00'} — taking you to book`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        router.push(`/book?quoteId=${encodeURIComponent(data.quoteId)}`);
      }
    } catch {
      toast({
        title: 'Something went wrong. Please try again.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 10, md: 14 }}
      aria-labelledby="quote-widget-heading"
    >
      <Container maxW="2xl" mx="auto" px={4}>
        <VStack spacing={6} align="stretch" textAlign="center">
          <Heading
            id="quote-widget-heading"
            as="h2"
            size="lg"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Get a quote in under a minute
          </Heading>
          <Text color="#EBF1FF" fontSize="md">
            Enter your pickup and dropoff postcodes, choose your move size, and
            see your price. No sign-up required.
          </Text>

          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="rgba(15, 15, 42, 0.8)"
            borderRadius="lg"
            p={6}
            borderWidth="1px"
            borderColor="rgba(123, 47, 255, 0.3)"
          >
            <VStack spacing={5} align="stretch">
              <HStack spacing={4} align="flex-start" flexWrap="wrap">
                <FormControl isRequired flex="1" minW="140px" position="relative">
                  <FormLabel color="#EBF1FF">From postcode</FormLabel>
                  <Input
                    id="quote-from-postcode"
                    value={fromPostcode}
                    onChange={(e) => {
                      setFromPostcode(e.target.value);
                      scheduleGeocode(e.target.value, true);
                    }}
                    onBlur={() => {
                      fromDebounceRef.current && clearTimeout(fromDebounceRef.current);
                      setTimeout(() => setFromSuggestions([]), 200);
                    }}
                    placeholder="e.g. SW1A 1AA"
                    bg="#06061A"
                    borderColor="rgba(123, 47, 255, 0.4)"
                    color="#F0EFFF"
                    _placeholder={{ color: 'gray.500' }}
                    maxLength={120}
                    aria-autocomplete="list"
                    aria-expanded={fromSuggestions.length > 0}
                    aria-controls="from-suggestions"
                    aria-activedescendant={undefined}
                  />
                  {fromSuggestions.length > 0 && (
                    <List
                      id="from-suggestions"
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      mt={1}
                      py={1}
                      bg="#0F0F2A"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="rgba(123, 47, 255, 0.4)"
                      boxShadow="lg"
                      zIndex={10}
                      role="listbox"
                    >
                      {fromSuggestions.map((s, i) => (
                        <ListItem
                          key={`${s.address}-${i}`}
                          px={3}
                          py={2}
                          cursor="pointer"
                          role="option"
                          borderBottomWidth={i < fromSuggestions.length - 1 ? '1px' : 0}
                          borderColor="rgba(123, 47, 255, 0.2)"
                          _hover={{ bg: 'rgba(123, 47, 255, 0.15)' }}
                          _focus={{ bg: 'rgba(123, 47, 255, 0.15)' }}
                          onClick={() => selectFrom(s)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Text fontSize="sm" color="#F0EFFF" noOfLines={2}>
                            {s.address}
                          </Text>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </FormControl>
                <FormControl isRequired flex="1" minW="140px" position="relative">
                  <FormLabel color="#EBF1FF">To postcode</FormLabel>
                  <Input
                    id="quote-to-postcode"
                    value={toPostcode}
                    onChange={(e) => {
                      setToPostcode(e.target.value);
                      scheduleGeocode(e.target.value, false);
                    }}
                    onBlur={() => {
                      toDebounceRef.current && clearTimeout(toDebounceRef.current);
                      setTimeout(() => setToSuggestions([]), 200);
                    }}
                    placeholder="e.g. M1 1AD"
                    bg="#06061A"
                    borderColor="rgba(123, 47, 255, 0.4)"
                    color="#F0EFFF"
                    _placeholder={{ color: 'gray.500' }}
                    maxLength={120}
                    aria-autocomplete="list"
                    aria-expanded={toSuggestions.length > 0}
                    aria-controls="to-suggestions"
                    aria-activedescendant={undefined}
                  />
                  {toSuggestions.length > 0 && (
                    <List
                      id="to-suggestions"
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      mt={1}
                      py={1}
                      bg="#0F0F2A"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="rgba(123, 47, 255, 0.4)"
                      boxShadow="lg"
                      zIndex={10}
                      role="listbox"
                    >
                      {toSuggestions.map((s, i) => (
                        <ListItem
                          key={`${s.address}-${i}`}
                          px={3}
                          py={2}
                          cursor="pointer"
                          role="option"
                          borderBottomWidth={i < toSuggestions.length - 1 ? '1px' : 0}
                          borderColor="rgba(123, 47, 255, 0.2)"
                          _hover={{ bg: 'rgba(123, 47, 255, 0.15)' }}
                          _focus={{ bg: 'rgba(123, 47, 255, 0.15)' }}
                          onClick={() => selectTo(s)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Text fontSize="sm" color="#F0EFFF" noOfLines={2}>
                            {s.address}
                          </Text>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel color="#EBF1FF">Move size</FormLabel>
                <RadioGroup
                  value={moveSize}
                  onChange={(v) => setMoveSize(v as MoveSize)}
                >
                  <Stack direction="row" spacing={6} flexWrap="wrap">
                    <Radio value="small" colorScheme="purple">
                      <Text as="span" color="#EBF1FF">Small (up to 5m³)</Text>
                    </Radio>
                    <Radio value="medium" colorScheme="purple">
                      <Text as="span" color="#EBF1FF">Medium (5–15m³)</Text>
                    </Radio>
                    <Radio value="large" colorScheme="purple">
                      <Text as="span" color="#EBF1FF">Large (15m³+)</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                size="lg"
                bg="#FFB800"
                color="#06061A"
                _hover={{ bg: '#E6A500' }}
                isLoading={loading}
                loadingText="Getting quote…"
                spinnerPlacement="start"
                isDisabled={!fromPostcode.trim() || !toPostcode.trim()}
                aria-label="Get instant quote"
              >
                Get price
              </Button>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}
