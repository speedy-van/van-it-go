import { Box } from '@chakra-ui/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" minH="100vh" bg="#06061A">
      {/* Sidebar will be added */}
      <Box bg="#0F0F2A" w={{ base: 'full', md: '250px' }} p={4}>
        Dashboard Menu
      </Box>
      {/* Main content */}
      <Box flex={1} p={6}>
        {children}
      </Box>
    </Box>
  );
}
