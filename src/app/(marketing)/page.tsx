'use client';

import { Container } from '@chakra-ui/react';
import { Hero } from '@/components/marketing/Hero';
import { TrustBadgesRow } from '@/components/marketing/TrustBadgesRow';
import { QuoteWidget } from '@/components/marketing/QuoteWidget';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { ServiceCards } from '@/components/marketing/ServiceCards';
import { HomeFAQ } from '@/components/marketing/HomeFAQ';
import { CityLinks } from '@/components/marketing/CityLinks';
import { DriverRecruitmentTeaser } from '@/components/marketing/DriverRecruitmentTeaser';
import { Testimonials } from '@/components/marketing/Testimonials';
import { CarbonOffsetBadge } from '@/components/marketing/CarbonOffsetBadge';
import { CTABanner } from '@/components/marketing/CTABanner';

export default function HomePage() {
  return (
    <Container maxW="full" p={0}>
      <Hero />
      <TrustBadgesRow />
      <QuoteWidget />
      <HowItWorks />
      <ServiceCards />
      <HomeFAQ />
      <CityLinks />
      <DriverRecruitmentTeaser />
      <Testimonials />
      <CarbonOffsetBadge />
      <CTABanner />
    </Container>
  );
}
