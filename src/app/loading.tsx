import { Box, Spinner } from '@chakra-ui/react';

export default function LoadingPage() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#06061A"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="#0F0F2A"
        color="#7B2FFF"
        size="xl"
      />
    </Box>
  );
}
