'use client';

import { useEffect } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#06061A"
    >
      <Box textAlign="center">
        <Heading color="#F0EFFF" mb={4}>
          Something went wrong!
        </Heading>
        <Text color="#EBF1FF" mb={8}>
          {error.message}
        </Text>
        <Button
          bg="#FFB800"
          color="#06061A"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </Box>
    </Box>
  );
}
