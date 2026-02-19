'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

const SECTION_BG = { light: '#06061A', dark: '#0F0F2A' };

const values = [
  {
    title: 'Transparent pricing',
    body: 'Instant quotes from postcode to postcode. No hidden fees.',
  },
  {
    title: 'Trusted drivers',
    body: 'Vetted professionals. Track your van on the day.',
  },
  {
    title: 'Stress-free moves',
    body: 'We handle the heavy lifting so you can focus on what matters.',
  },
];

export default function AboutPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box>
      <Box as="section" bg={SECTION_BG.light} py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              About VanItGo
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" lineHeight="1.8" maxW="2xl" mx="auto">
              We built VanItGo for people who hate moving stress. Get an instant
              quote, choose a trusted driver, and track your van on the day. No
              call centres, no guesswork—just a simple, reliable man and van
              service.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg={SECTION_BG.dark} py={{ base: 12, md: 16 }}>
        <Container maxW="6xl" mx="auto" px={4}>
          <Heading
            as="h2"
            size="lg"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
            textAlign="center"
            mb={10}
          >
            What we stand for
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {values.map((item) => (
              <Box
                key={item.title}
                p={6}
                bg={SECTION_BG.light}
                borderRadius="10px"
                borderWidth="1px"
                borderColor="rgba(123, 47, 255, 0.2)"
                transition={
                  prefersReducedMotion ? undefined : 'border-color 0.2s, box-shadow 0.2s'
                }
                _hover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        borderColor: '#7B2FFF',
                        boxShadow: '0 0 20px rgba(123, 47, 255, 0.2)',
                      }
                }
              >
                <Heading as="h3" size="md" color="#7B2FFF" mb={3}>
                  {item.title}
                </Heading>
                <Text color="#EBF1FF" fontSize="sm">
                  {item.body}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" bg={SECTION_BG.light} py={{ base: 12, md: 16 }}>
        <Container maxW="3xl" mx="auto" px={4}>
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h2"
              size="lg"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Ready to move?
            </Heading>
            <Text color="#EBF1FF">
              Get your instant quote in under a minute. No sign-up required.
            </Text>
            <Link href="/book" passHref legacyBehavior>
              <Button
                as="a"
                size="lg"
                bg="#FFB800"
                color="#06061A"
                _hover={{ bg: '#E6A500' }}
              >
                Get Instant Quote
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
