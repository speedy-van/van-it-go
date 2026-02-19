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

export function ServiceCards() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 12, md: 16 }}
      aria-labelledby="services-heading"
    >
      <Container maxW="6xl" mx="auto" px={4}>
        <Heading
          id="services-heading"
          as="h2"
          size="xl"
          color="#F0EFFF"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAlign="center"
          mb={10}
        >
          Our services
        </Heading>

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
                  prefersReducedMotion ? undefined : 'border-color 0.2s, box-shadow 0.2s'
                }
                role="listitem"
                aria-label={`${service.title} - ${service.description}`}
              >
                <VStack align="stretch" spacing={3} textAlign="left">
                  <Heading as="h3" size="md" color="#7B2FFF">
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

        <Box textAlign="center" mt={8}>
          <Link href="/services" passHref legacyBehavior>
            <ChakraLink color="#FFB800" fontWeight="600" aria-label="View all services">
              View all services →
            </ChakraLink>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
