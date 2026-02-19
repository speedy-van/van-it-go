'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  Button,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import Link from 'next/link';

const SECTION_BG = { light: '#06061A', dark: '#0F0F2A' };

const features = [
  'Instant quote from postcodes',
  'No hidden fees',
  'Secure payment at confirmation',
  'Track your driver on the day',
  'Vetted drivers',
];

export default function PricingPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box>
      <Box as="section" bg={SECTION_BG.light} py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Simple, transparent pricing
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
              Your price is based on distance (from your postcodes) and move
              size. Enter your details on the booking page to get an instant
              quote—no sign-up required.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg={SECTION_BG.dark} py={{ base: 12, md: 16 }}>
        <Container maxW="md" mx="auto" px={4}>
          <Box
            p={8}
            bg={SECTION_BG.light}
            borderRadius="12px"
            borderWidth="2px"
            borderColor="#7B2FFF"
            transition={
              prefersReducedMotion ? undefined : 'box-shadow 0.2s'
            }
            _hover={
              prefersReducedMotion
                ? undefined
                : { boxShadow: '0 0 30px rgba(123, 47, 255, 0.3)' }
            }
          >
            <Heading
              as="h2"
              size="lg"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
              textAlign="center"
              mb={2}
            >
              Pay for what you need
            </Heading>
            <Text color="#EBF1FF" fontSize="sm" textAlign="center" mb={6}>
              Quote in under a minute. No card until you confirm.
            </Text>
            <List spacing={3} mb={8}>
              {features.map((f) => (
                <ListItem key={f} color="#EBF1FF" display="flex" alignItems="center" gap={2}>
                  <Text as="span" color="#7B2FFF" fontWeight="bold" aria-hidden>✓</Text>
                  {f}
                </ListItem>
              ))}
            </List>
            <Link href="/book" passHref legacyBehavior>
              <Button
                as="a"
                w="full"
                size="lg"
                bg="#FFB800"
                color="#06061A"
                _hover={{ bg: '#E6A500' }}
              >
                Get your instant quote
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
