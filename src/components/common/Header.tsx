'use client';

import { Box, Button, Container, HStack, Heading } from '@chakra-ui/react';
import Link from 'next/link';

export function Header() {
  return (
    <Box as="header" bg="#0F0F2A" py={4} borderBottomWidth={1} borderBottomColor="rgba(123, 47, 255, 0.2)">
      <Container maxW="7xl" mx="auto" px={4}>
        <HStack justify="space-between">
          <Heading as="h1" size="lg" color="#7B2FFF" fontFamily="Plus Jakarta Sans">
            <Link href="/">VanItGo</Link>
          </Heading>
          <HStack spacing={4}>
            <Link href="/book">
              <Button variant="ghost" color="#F0EFFF">
                Get Quote
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" color="#F0EFFF">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button bg="#FFB800" color="#06061A">
                Sign In
              </Button>
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
