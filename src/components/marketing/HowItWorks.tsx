'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  useBreakpointValue,
  usePrefersReducedMotion,
} from '@chakra-ui/react';

const steps = [
  {
    number: '1',
    title: 'Enter addresses',
    description: 'Pickup and dropoff. We use your postcode to calculate distance and price.',
  },
  {
    number: '2',
    title: 'Choose size & date',
    description: 'Tell us how much you are moving and when. Get an instant quote.',
  },
  {
    number: '3',
    title: 'Book & pay',
    description: 'Secure payment. Your driver is assigned and you can track the van on the day.',
  },
];

export function HowItWorks() {
  const isVertical = useBreakpointValue({ base: true, md: false });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box
      as="section"
      id="how-it-works"
      bg="#06061A"
      py={{ base: 12, md: 16 }}
      aria-labelledby="how-it-works-heading"
    >
      <Container maxW="5xl" mx="auto" px={4}>
        <Heading
          id="how-it-works-heading"
          as="h2"
          size="xl"
          color="#F0EFFF"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAlign="center"
          mb={10}
        >
          How it works
        </Heading>

        <HStack
          align="stretch"
          spacing={{ base: 0, md: 8 }}
          flexDirection={isVertical ? 'column' : 'row'}
          justify="space-between"
          role="list"
          aria-label="Steps to book a move"
        >
          {steps.map((step) => (
            <VStack
              key={step.number}
              flex={1}
              align="center"
              textAlign="center"
              spacing={4}
              py={6}
              px={4}
              role="listitem"
              transition={prefersReducedMotion ? undefined : 'transform 0.2s'}
              _hover={prefersReducedMotion ? {} : { transform: 'translateY(-4px)' }}
            >
              <Box
                w={14}
                h={14}
                borderRadius="full"
                bg="#7B2FFF"
                color="#F0EFFF"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="xl"
                aria-hidden
              >
                {step.number}
              </Box>
              <Heading as="h3" size="md" color="#F0EFFF">
                {step.title}
              </Heading>
              <Text color="#EBF1FF" fontSize="sm" maxW="xs">
                {step.description}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Container>
    </Box>
  );
}
