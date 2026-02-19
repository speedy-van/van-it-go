'use client';

import { Box, Container, Heading, SimpleGrid, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const CITIES = [
  { name: 'Edinburgh', slug: 'edinburgh' },
  { name: 'Glasgow', slug: 'glasgow' },
  { name: 'Aberdeen', slug: 'aberdeen' },
  { name: 'Dundee', slug: 'dundee' },
  { name: 'Inverness', slug: 'inverness' },
  { name: 'Stirling', slug: 'stirling' },
  { name: 'Perth', slug: 'perth' },
  { name: 'St Andrews', slug: 'st-andrews' },
];

export function CityLinks() {
  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 12, md: 16 }}
      aria-labelledby="city-links-heading"
    >
      <Container maxW="6xl" mx="auto" px={4}>
        <Heading
          id="city-links-heading"
          as="h2"
          size="lg"
          color="#F0EFFF"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAlign="center"
          mb={2}
        >
          We cover Scotland and the UK
        </Heading>
        <Text color="#EBF1FF" textAlign="center" mb={8} fontSize="md">
          Instant quotes for moves in and around these cities
        </Text>
        <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
          {CITIES.map(({ name, slug }) => (
            <Link
              key={slug}
              as={NextLink}
              href={`/cities/${slug}`}
              py={3}
              px={4}
              borderRadius="8px"
              bg="rgba(123, 47, 255, 0.1)"
              borderWidth="1px"
              borderColor="rgba(123, 47, 255, 0.3)"
              color="#F0EFFF"
              _hover={{
                bg: 'rgba(123, 47, 255, 0.2)',
                borderColor: '#7B2FFF',
              }}
              textAlign="center"
              fontWeight="500"
            >
              {name}
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
