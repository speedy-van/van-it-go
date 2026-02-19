'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';

const TESTIMONIALS = [
  {
    quote:
      'Got a quote in seconds and the driver turned up on time. Made moving flat so much easier.',
    author: 'Sarah M.',
    location: 'Edinburgh',
  },
  {
    quote:
      'Professional and hassle-free. Price matched what I was quoted—no hidden fees.',
    author: 'James K.',
    location: 'Glasgow',
  },
  {
    quote:
      'Tracked the van on the app. Brilliant service from start to finish.',
    author: 'Emma L.',
    location: 'Aberdeen',
  },
];

export function Testimonials() {
  const columns = useBreakpointValue({ base: 1, md: 3 }) ?? 1;
  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 12, md: 16 }}
      aria-labelledby="testimonials-heading"
    >
      <Container maxW="6xl" mx="auto" px={4}>
        <Heading
          id="testimonials-heading"
          as="h2"
          size="lg"
          color="#F0EFFF"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAlign="center"
          mb={8}
        >
          What our customers say
        </Heading>
        <SimpleGrid columns={columns} spacing={6}>
          {TESTIMONIALS.map((t, i) => (
            <Box
              key={i}
              p={6}
              borderRadius="lg"
              bg="rgba(15, 15, 42, 0.9)"
              borderWidth="1px"
              borderColor="rgba(123, 47, 255, 0.3)"
            >
              <VStack align="stretch" spacing={4}>
                <Text color="#EBF1FF" fontStyle="italic">
                  &ldquo;{t.quote}&rdquo;
                </Text>
                <Text color="#F0EFFF" fontWeight="600" fontSize="sm">
                  — {t.author}
                </Text>
                <Text color="gray.400" fontSize="xs">
                  {t.location}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
