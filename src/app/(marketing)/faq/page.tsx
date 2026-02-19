'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

const faqs = [
  {
    q: 'How do I get a quote?',
    a: 'Enter your pickup and dropoff postcodes on the booking page, choose your move size and date, and you will see an instant price. No sign-up required.',
  },
  {
    q: 'When do I pay?',
    a: 'You can get a quote and reserve your slot without paying. Payment is taken when you confirm your booking. We accept card and other secure methods.',
  },
  {
    q: 'Can I track my driver on the day?',
    a: 'Yes. Once your driver is assigned, you can track their location in real time so you know when to expect them.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We operate across the UK. Enter your postcodes on the booking page to check availability and get a quote for your area.',
  },
  {
    q: 'What if I need to cancel or reschedule?',
    a: 'You can cancel or reschedule from your dashboard or by contacting us. Our cancellation policy depends on how close you are to the move date—see your booking confirmation for details.',
  },
];

export default function FAQPage() {
  return (
    <Box>
      <Box as="section" bg="#06061A" py={{ base: 12, md: 16 }}>
        <Container maxW="4xl" mx="auto" px={4}>
          <VStack spacing={6} align="stretch" textAlign="center" mb={10}>
            <Heading
              as="h1"
              size="xl"
              color="#F0EFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Frequently asked questions
            </Heading>
            <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
              Quick answers to common questions about quotes, payment, and
              bookings.
            </Text>
          </VStack>

          <Accordion allowMultiple borderColor="rgba(123, 47, 255, 0.2)">
            {faqs.map((item, i) => (
              <AccordionItem key={i} bg="#0F0F2A" mb={3} borderRadius="8px" overflow="hidden">
                <AccordionButton
                  py={4}
                  px={5}
                  color="#F0EFFF"
                  _expanded={{ bg: 'rgba(123, 47, 255, 0.1)' }}
                  _hover={{ bg: 'rgba(123, 47, 255, 0.08)' }}
                >
                  <Box as="span" flex="1" textAlign="left" fontWeight="600">
                    {item.q}
                  </Box>
                  <AccordionIcon color="#7B2FFF" />
                </AccordionButton>
                <AccordionPanel pb={4} px={5} pt={0} color="#EBF1FF">
                  {item.a}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Box>
    </Box>
  );
}
