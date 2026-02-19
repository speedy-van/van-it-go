'use client';

import { useState } from 'react';
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
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';

type MoveSize = 'small' | 'medium' | 'large';

interface WidgetResult {
  quoteId: string;
  priceGBP: number;
  distanceMiles: number;
  etaMinutes: number;
}

export function QuoteWidget() {
  const [fromPostcode, setFromPostcode] = useState('');
  const [toPostcode, setToPostcode] = useState('');
  const [moveSize, setMoveSize] = useState<MoveSize>('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WidgetResult | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const from = fromPostcode.trim();
    const to = toPostcode.trim();
    if (!from || !to) {
      toast({ title: 'Please enter both postcodes', status: 'warning', isClosable: true });
      return;
    }
    setLoading(true);
    setResult(null);
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
        setResult({
          quoteId: data.quoteId,
          priceGBP: data.priceGBP,
          distanceMiles: data.distanceMiles,
          etaMinutes: data.etaMinutes,
        });
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
                <FormControl isRequired flex="1" minW="140px">
                  <FormLabel color="#EBF1FF">From postcode</FormLabel>
                  <Input
                    value={fromPostcode}
                    onChange={(e) => setFromPostcode(e.target.value)}
                    placeholder="e.g. SW1A 1AA"
                    bg="#06061A"
                    borderColor="rgba(123, 47, 255, 0.4)"
                    color="#F0EFFF"
                    _placeholder={{ color: 'gray.500' }}
                    maxLength={20}
                  />
                </FormControl>
                <FormControl isRequired flex="1" minW="140px">
                  <FormLabel color="#EBF1FF">To postcode</FormLabel>
                  <Input
                    value={toPostcode}
                    onChange={(e) => setToPostcode(e.target.value)}
                    placeholder="e.g. M1 1AD"
                    bg="#06061A"
                    borderColor="rgba(123, 47, 255, 0.4)"
                    color="#F0EFFF"
                    _placeholder={{ color: 'gray.500' }}
                    maxLength={20}
                  />
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

          {result && (
            <Box
              p={6}
              bg="rgba(123, 47, 255, 0.15)"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="rgba(123, 47, 255, 0.4)"
              w="full"
              textAlign="center"
            >
              <VStack spacing={3}>
                <Text color="#EBF1FF" fontSize="lg">
                  Your estimated price
                </Text>
                <Heading size="xl" color="#FFB800">
                  £{result.priceGBP.toFixed(2)}
                </Heading>
                <Text color="#EBF1FF" fontSize="sm">
                  {result.distanceMiles.toFixed(1)} miles · ~{result.etaMinutes} min
                </Text>
                <Link href={`/book?quoteId=${encodeURIComponent(result.quoteId)}`} passHref legacyBehavior>
                  <Button
                    as="a"
                    size="lg"
                    bg="#7B2FFF"
                    color="white"
                    _hover={{ bg: '#6A28E6' }}
                    aria-label="Book this move"
                  >
                    Book this
                  </Button>
                </Link>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
