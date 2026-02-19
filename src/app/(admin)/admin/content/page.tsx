'use client';

import { Container, Heading, Text, Box } from '@chakra-ui/react';

export default function AdminContentPage() {
  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={2} color="#EBF1FF">
        Content
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={6}>
        Site content and copy management.
      </Text>
      <Box p={6} bg="#0F0F2A" borderRadius="10px" borderLeft="4px solid #7B2FFF">
        <Text color="gray.500">Content management controls can be added here.</Text>
      </Box>
    </Container>
  );
}
