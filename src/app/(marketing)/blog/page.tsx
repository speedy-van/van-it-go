'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

export default function BlogPage() {
  return (
    <Box>
      <Box as="section" bg="#06061A" py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Blog
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
              Tips for moving house, packing, and making your move stress-free.
              New posts added regularly.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg="#0F0F2A" py={{ base: 12, md: 16 }}>
        <Container maxW="3xl" mx="auto" px={4}>
          <Box
            p={8}
            bg="#06061A"
            borderRadius="10px"
            borderWidth="1px"
            borderColor="rgba(123, 47, 255, 0.2)"
          >
            <Text color="#EBF1FF" textAlign="center">
              No posts yet. Check back soon for moving tips and updates.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
