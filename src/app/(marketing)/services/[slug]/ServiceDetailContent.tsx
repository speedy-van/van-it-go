'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import type { SERVICES } from '@/lib/marketing/services';

type Service = (typeof SERVICES)[number];

export function ServiceDetailContent({ service }: { service: Service }) {
  return (
    <Box>
      <Box as="section" bg="#06061A" py={{ base: 12, md: 16 }}>
        <Container maxW="3xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {service.title}
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" lineHeight="1.8">
              {service.longDescription}
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg="#0F0F2A" py={{ base: 12, md: 16 }}>
        <Container maxW="3xl" mx="auto" px={4}>
          <VStack spacing={6} textAlign="center">
            <Heading as="h2" size="md" color="#F0EFFF">
              Get your instant quote
            </Heading>
            <Text color="#EBF1FF">
              Enter your pickup and dropoff postcodes to see your price. No
              sign-up required.
            </Text>
            <Link href="/book" passHref legacyBehavior>
              <Button
                as="a"
                size="lg"
                bg="#FFB800"
                color="#06061A"
                _hover={{ bg: '#E6A500' }}
              >
                Get Instant Quote
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
