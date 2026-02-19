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

const FAQ_ITEMS = [
  {
    q: 'How do I get a quote?',
    a: 'Enter your pickup and dropoff postcodes in the quote widget above or on the booking page, choose your move size, and you will see an instant price. No sign-up required.',
  },
  {
    q: 'When do I pay?',
    a: 'You can get a quote and reserve your slot without paying. Payment is taken when you confirm your booking. We accept card and other secure methods via Stripe.',
  },
  {
    q: 'Can I track my driver on the day?',
    a: 'Yes. Once your driver is assigned, you can track their location in real time so you know when to expect them.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We operate across the UK, including Scotland (Edinburgh, Glasgow, Aberdeen, Dundee, Inverness and more). Enter your postcodes to check availability and get a quote.',
  },
  {
    q: 'What if I need to cancel or reschedule?',
    a: 'You can cancel or reschedule from your dashboard or by contacting us at support@speedy-van.co.uk or 01202 129746. Our cancellation policy depends on how close you are to the move date.',
  },
  {
    q: 'How is the price calculated?',
    a: 'Your price is based on distance (from your postcodes), move size (volume), and any extras like floors without a lift. The quote widget and booking flow show the breakdown before you confirm.',
  },
  {
    q: 'Do you offer carbon offset?',
    a: 'Yes. You can add carbon offset to your move at checkout. We work with verified providers to offset the emissions for your journey.',
  },
  {
    q: 'Can I become a driver with VanItGo?',
    a: 'Yes. We are always looking for reliable drivers. Look for the "Earn with VanItGo" section on this page or contact us for driver recruitment.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export function HomeFAQ() {
  return (
    <Box
      as="section"
      bg="#06061A"
      py={{ base: 12, md: 16 }}
      aria-labelledby="home-faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container maxW="4xl" mx="auto" px={4}>
        <VStack spacing={6} align="stretch" textAlign="center" mb={10}>
          <Heading
            id="home-faq-heading"
            as="h2"
            size="xl"
            color="#F0EFFF"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Frequently asked questions
          </Heading>
          <Text color="#EBF1FF" fontSize="lg" maxW="2xl" mx="auto">
            Quick answers about quotes, payment, and bookings.
          </Text>
        </VStack>

        <Accordion allowMultiple borderColor="rgba(123, 47, 255, 0.2)">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              bg="#0F0F2A"
              mb={3}
              borderRadius="8px"
              overflow="hidden"
            >
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
  );
}
