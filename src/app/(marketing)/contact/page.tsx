'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';

const PHONE = '01202 129746';
const EMAIL = 'support@speedy-van.co.uk';

export default function ContactPage() {

  return (
    <Box>
      <Box as="section" bg="#06061A" py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={8} align="stretch" textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Contact us
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
              Questions about your booking, quote, or our services? Get in touch
              by phone or email. We aim to respond within one working day.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg="#0F0F2A" py={{ base: 12, md: 16 }}>
        <Container maxW="2xl" mx="auto" px={4}>
          <VStack spacing={10} align="stretch">
            <Box
              p={8}
              bg="#06061A"
              borderRadius="10px"
              borderWidth="1px"
              borderColor="rgba(123, 47, 255, 0.2)"
            >
              <Heading as="h2" size="md" color="#7B2FFF" mb={4}>
                Phone
              </Heading>
              <ChakraLink
                href={`tel:${PHONE.replace(/\s/g, '')}`}
                color="#FFB800"
                fontSize="lg"
                fontWeight="600"
                _hover={{ textDecoration: 'underline' }}
              >
                {PHONE}
              </ChakraLink>
            </Box>
            <Box
              p={8}
              bg="#06061A"
              borderRadius="10px"
              borderWidth="1px"
              borderColor="rgba(123, 47, 255, 0.2)"
            >
              <Heading as="h2" size="md" color="#7B2FFF" mb={4}>
                Email
              </Heading>
              <ChakraLink
                href={`mailto:${EMAIL}`}
                color="#FFB800"
                fontSize="lg"
                fontWeight="600"
                _hover={{ textDecoration: 'underline' }}
              >
                {EMAIL}
              </ChakraLink>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
