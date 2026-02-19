import { Box } from '@chakra-ui/react';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" minH="100vh" bg="#06061A">
      {/* Driver Portal Sidebar */}
      <Box bg="#0F0F2A" w={{ base: 'full', md: '250px' }} p={4}>
        Driver Menu
      </Box>
      <Box flex={1} p={6}>
        {children}
      </Box>
    </Box>
  );
}
