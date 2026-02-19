'use client';

import { Box, Container, HStack, Text, VStack } from '@chakra-ui/react';

const BADGES = [
  { icon: '✓', label: 'Instant quote', sub: 'No sign-up' },
  { icon: '🔒', label: 'Secure payment', sub: 'Stripe' },
  { icon: '📍', label: 'Live tracking', sub: 'Real-time map' },
  { icon: '⭐', label: 'Rated drivers', sub: 'Verified' },
];

export function TrustBadgesRow() {
  return (
    <Box
      as="section"
      bg="#0F0F2A"
      py={{ base: 6, md: 8 }}
      borderBottomWidth="1px"
      borderColor="rgba(123, 47, 255, 0.2)"
      aria-label="Trust badges"
    >
      <Container maxW="6xl" mx="auto" px={4}>
        <HStack
          spacing={{ base: 6, md: 10 }}
          justify="center"
          flexWrap="wrap"
          gap={4}
        >
          {BADGES.map(({ icon, label, sub }) => (
            <HStack key={label} spacing={3} flex="1" minW="120px" justify="center">
              <Box
                w={10}
                h={10}
                borderRadius="full"
                bg="rgba(123, 47, 255, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
              >
                {icon}
              </Box>
              <VStack align="start" spacing={0}>
                <Text color="#F0EFFF" fontWeight="semibold" fontSize="sm">
                  {label}
                </Text>
                <Text color="#EBF1FF" fontSize="xs" opacity={0.9}>
                  {sub}
                </Text>
              </VStack>
            </HStack>
          ))}
        </HStack>
      </Container>
    </Box>
  );
}
