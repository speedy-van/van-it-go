'use client';

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export function InstantQuote() {
  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 10, md: 14 }}
      aria-labelledby="instant-quote-heading"
    >
      <Container maxW="2xl" mx="auto" px={4}>
        <VStack spacing={6} textAlign="center">
          <Heading
            id="instant-quote-heading"
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
          <Link href="/book" passHref legacyBehavior>
            <Button
              as="a"
              size="lg"
              bg="#FFB800"
              color="#06061A"
              _hover={{ bg: '#E6A500' }}
              aria-label="Start booking for instant quote"
            >
              Start Your Booking
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
