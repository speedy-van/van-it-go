'use client';

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export function CTABanner() {
  return (
    <Box
      as="section"
      bg="linear-gradient(135deg, #7B2FFF 0%, #4F00C1 100%)"
      py={{ base: 12, md: 16 }}
      aria-labelledby="cta-heading"
    >
      <Container maxW="3xl" mx="auto" px={4}>
        <VStack spacing={6} textAlign="center">
          <Heading
            id="cta-heading"
            as="h2"
            size="lg"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Ready to move?
          </Heading>
          <Text color="#E0DEFF" fontSize="md">
            Get your instant quote now. No card required until you confirm your
            booking.
          </Text>
          <Link href="/book" passHref legacyBehavior>
            <Button
              as="a"
              size="lg"
              bg="#FFB800"
              color="#06061A"
              _hover={{ bg: '#E6A500' }}
              aria-label="Get instant quote"
            >
              Get Instant Quote
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
