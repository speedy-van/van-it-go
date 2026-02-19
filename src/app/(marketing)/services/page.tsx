'use client';

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Link as ChakraLink,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import Link from 'next/link';
import { SERVICES } from '@/lib/marketing/services';

export default function ServicesPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box>
      <Box as="section" bg="#06061A" py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center" mb={10}>
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Our services
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
              From full house moves to single items and eBay deliveries. Get an
              instant quote for any of the services below.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg="#0F0F2A" py={{ base: 10, md: 14 }}>
        <Container maxW="6xl" mx="auto" px={4}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} role="list">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                passHref
                legacyBehavior
              >
                <ChakraLink
                  as="div"
                  display="block"
                  p={6}
                  bg="#06061A"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor="rgba(123, 47, 255, 0.2)"
                  _hover={{
                    borderColor: '#7B2FFF',
                    boxShadow: '0 0 20px rgba(123, 47, 255, 0.2)',
                  }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : 'border-color 0.2s, box-shadow 0.2s'
                  }
                  role="listitem"
                >
                  <VStack align="stretch" spacing={3} textAlign="left">
                    <Heading as="h2" size="md" color="#7B2FFF">
                      {service.title}
                    </Heading>
                    <Text color="#EBF1FF" fontSize="sm">
                      {service.description}
                    </Text>
                  </VStack>
                </ChakraLink>
              </Link>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
