'use client';

import { Container } from '@chakra-ui/react';
import { Hero } from '@/components/marketing/Hero';
import { InstantQuote } from '@/components/marketing/InstantQuote';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { ServiceCards } from '@/components/marketing/ServiceCards';
import { CTABanner } from '@/components/marketing/CTABanner';

export default function HomePage() {
  return (
    <Container maxW="full" p={0}>
      <Hero />
      <InstantQuote />
      <HowItWorks />
      <ServiceCards />
      <CTABanner />
    </Container>
  );
}
