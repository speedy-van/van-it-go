import { Box } from '@chakra-ui/react';

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box minH="100vh" bg="#06061A" pt={8}>
      {children}
    </Box>
  );
}
