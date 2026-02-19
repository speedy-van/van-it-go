import { Box } from '@chakra-ui/react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box as="main" flex={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
