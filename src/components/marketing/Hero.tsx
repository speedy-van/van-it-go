'use client';

import { Box, Container, Heading, Text, Button, Stack, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const HERO_HEADLINE = 'Built for people who hate moving stress';
const HERO_SUBHEADLINE =
  'Instant quote. Trusted driver. Live map. We handle the hard part.';

export function Hero() {
  return (
    <Box
      as="section"
      bg="#06061A"
      py={{ base: 12, md: 20 }}
      aria-labelledby="hero-heading"
    >
      <Container maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="center" textAlign="center">
          <Heading
            id="hero-heading"
            as="h1"
            size="2xl"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
            mb={4}
          >
            {HERO_HEADLINE}
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="#EBF1FF"
            maxW="2xl"
            lineHeight="1.8"
          >
            {HERO_SUBHEADLINE}
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            pt={6}
            role="group"
            aria-label="Primary actions"
          >
            <Link href="/book" passHref legacyBehavior>
              <Button
                as="a"
                size="lg"
                bg="#FFB800"
                color="#06061A"
                _hover={{ bg: '#E6A500', transform: 'translateY(-2px)' }}
                aria-label="Get instant quote"
              >
                Get Instant Quote
              </Button>
            </Link>
            <Link href="/#how-it-works" passHref legacyBehavior>
              <Button
                as="a"
                size="lg"
                variant="outline"
                borderColor="#7B2FFF"
                color="#7B2FFF"
                _hover={{ bg: 'rgba(123, 47, 255, 0.1)' }}
                aria-label="How it works"
              >
                How It Works
              </Button>
            </Link>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
}
