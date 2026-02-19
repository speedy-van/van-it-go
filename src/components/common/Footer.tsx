'use client';

import {
  Box,
  Container,
  Text,
  HStack,
  Link as ChakraLink,
  Divider,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';

const PHONE = '01202 129746';
const EMAIL = 'support@speedy-van.co.uk';

export function Footer() {
  return (
    <Box as="footer" bg="#0F0F2A" py={12} mt={16} role="contentinfo">
      <Container maxW="7xl" mx="auto" px={4}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-around" wrap="wrap" spacing={4}>
            <Link href="/about" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">About</ChakraLink>
            </Link>
            <Link href="/services" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">Services</ChakraLink>
            </Link>
            <Link href="/pricing" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">Pricing</ChakraLink>
            </Link>
            <Link href="/faq" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">FAQ</ChakraLink>
            </Link>
            <Link href="/contact" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">Contact</ChakraLink>
            </Link>
            <Link href="/blog" passHref legacyBehavior>
              <ChakraLink color="#EBF1FF">Blog</ChakraLink>
            </Link>
          </HStack>
          <HStack justify="center" spacing={6} flexWrap="wrap">
            <ChakraLink href={`tel:${PHONE.replace(/\s/g, '')}`} color="#FFB800">
              {PHONE}
            </ChakraLink>
            <ChakraLink href={`mailto:${EMAIL}`} color="#FFB800">
              {EMAIL}
            </ChakraLink>
          </HStack>
          <Divider borderColor="rgba(123, 47, 255, 0.2)" />
          <Text textAlign="center" color="#EBF1FF" fontSize="sm">
            © {new Date().getFullYear()} VanItGo. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
