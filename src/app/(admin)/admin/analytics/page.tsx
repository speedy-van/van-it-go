'use client';

import { Container, Heading, Text, Box } from '@chakra-ui/react';

export default function AdminAnalyticsPage() {
  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={2} color="#EBF1FF">
        Analytics
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={6}>
        Performance and usage analytics. Configure date ranges and export reports from the Dashboard and Bookings sections.
      </Text>
      <Box p={6} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Text color="gray.500">Analytics charts and reports can be added here. Use the Dashboard for key metrics and date filtering.</Text>
      </Box>
    </Container>
  );
}
