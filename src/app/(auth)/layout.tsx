import { Box } from '@chakra-ui/react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#06061A"
    >
      {children}
    </Box>
  );
}
