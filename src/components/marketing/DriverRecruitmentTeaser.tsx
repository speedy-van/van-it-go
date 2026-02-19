'use client';

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export function DriverRecruitmentTeaser() {
  return (
    <Box
      as="section"
      bg="#06061A"
      py={{ base: 12, md: 16 }}
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="rgba(123, 47, 255, 0.2)"
      aria-labelledby="driver-teaser-heading"
    >
      <Container maxW="4xl" mx="auto" px={4}>
        <VStack spacing={6} textAlign="center">
          <Heading
            id="driver-teaser-heading"
            as="h2"
            size="lg"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Earn with VanItGo
          </Heading>
          <Text color="#EBF1FF" fontSize="md" maxW="2xl">
            Join our network of trusted drivers. Set your availability, get matched with
            local moves, and get paid securely. We handle the bookings and payments—you
            focus on the road.
          </Text>
          <Link href="/contact" passHref legacyBehavior>
            <Button
              as="a"
              size="lg"
              variant="outline"
              borderColor="#7B2FFF"
              color="#7B2FFF"
              _hover={{ bg: 'rgba(123, 47, 255, 0.1)' }}
              aria-label="Find out about driving with VanItGo"
            >
              Find out more
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
