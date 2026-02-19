'use client';

import { Box, Container, Heading, Text, HStack, VStack } from '@chakra-ui/react';

export function CarbonOffsetBadge() {
  return (
    <Box
      as="section"
      bg="#06061A"
      py={{ base: 10, md: 12 }}
      borderTopWidth="1px"
      borderColor="rgba(123, 47, 255, 0.2)"
      aria-labelledby="carbon-badge-heading"
    >
      <Container maxW="4xl" mx="auto" px={4}>
        <HStack
          spacing={6}
          justify="center"
          align="center"
          flexWrap="wrap"
          bg="rgba(34, 197, 94, 0.08)"
          borderRadius="lg"
          p={6}
          borderWidth="1px"
          borderColor="rgba(34, 197, 94, 0.3)"
        >
          <Box
            aria-hidden
            fontSize="3xl"
            role="img"
          >
            🌱
          </Box>
          <VStack align="start" spacing={1} flex="1" minW="200px">
            <Heading
              id="carbon-badge-heading"
              as="h2"
              size="md"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Carbon offset available
            </Heading>
            <Text color="#EBF1FF" fontSize="sm">
              Add carbon offset to your move at checkout. We partner with verified
              providers to offset the emissions for your journey.
            </Text>
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
}
