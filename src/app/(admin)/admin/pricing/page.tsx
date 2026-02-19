'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Card,
  CardBody,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  HStack,
} from '@chakra-ui/react';

type PricingConfig = {
  basePrice: number;
  pricePerKm: number;
  pricePerCubicMeter: number;
  minPrice: number;
  serviceMultipliers: Record<string, number>;
  bulkDiscount: {
    volumeThreshold: number;
    discountPercent: number;
  };
};

const SERVICE_LABELS: Record<string, string> = {
  house_move: 'House move',
  office_move: 'Office move',
  single_item: 'Single item',
  student_move: 'Student move',
  ebay_delivery: 'eBay / delivery',
};

export default function AdminPricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/pricing-rules')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config);
        } else {
          setError(data.error || 'Failed to load pricing');
        }
      })
      .catch(() => setError('Failed to load pricing'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  if (loading) {
    return (
      <Container maxW="full" py={0}>
        <Heading size="lg" mb={6} color="#EBF1FF">Pricing</Heading>
        <HStack justify="center" py={12}>
          <Spinner size="lg" color="#7B2FFF" />
        </HStack>
      </Container>
    );
  }

  if (error || !config) {
    return (
      <Container maxW="full" py={0}>
        <Heading size="lg" mb={6} color="#EBF1FF">Pricing</Heading>
        <Text color="red.400">{error ?? 'No config'}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={2} color="#EBF1FF">
        Pricing rules
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={6}>
        Current rates used for quotes. Defined in <Text as="code" fontSize="xs" bg="whiteAlpha.100" px={1}>src/lib/pricing</Text>; change there to update live quotes.
      </Text>

      <VStack align="stretch" spacing={6}>
        <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Base & rates
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Base price</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="xl">£{config.basePrice}</Text>
                <Text fontSize="xs" color="gray.500">Per job</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Price per km</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="xl">£{config.pricePerKm}</Text>
                <Text fontSize="xs" color="gray.500">Distance</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Price per m³</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="xl">£{config.pricePerCubicMeter}</Text>
                <Text fontSize="xs" color="gray.500">Volume</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Minimum price</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="xl">£{config.minPrice}</Text>
                <Text fontSize="xs" color="gray.500">Floor per quote</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card bg="#0F0F2A" borderLeft="4px solid #FFB800">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Service multipliers
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={4}>
              Applied to (base + distance + volume). 1.0 = standard; &lt;1 = discount; &gt;1 = premium.
            </Text>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.400">Service type</Th>
                    <Th color="gray.400">Multiplier</Th>
                    <Th color="gray.400">Effect</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(config.serviceMultipliers).map(([key, value]) => (
                    <Tr key={key}>
                      <Td color="#EBF1FF" fontWeight="medium">
                        {SERVICE_LABELS[key] ?? key}
                      </Td>
                      <Td color="#EBF1FF" fontFamily="monospace">
                        {value}×
                      </Td>
                      <Td color="gray.400" fontSize="sm">
                        {value === 1 ? 'Standard' : value < 1 ? 'Discount' : 'Premium'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Bulk discount
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Volume threshold</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="lg">{config.bulkDiscount.volumeThreshold} m³</Text>
                <Text fontSize="xs" color="gray.500">When volume ≥ this, discount applies</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Discount</Text>
                <Text color="#EBF1FF" fontWeight="bold" fontSize="lg">{config.bulkDiscount.discountPercent}%</Text>
                <Text fontSize="xs" color="gray.500">Off subtotal</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Box p={4} bg="rgba(123, 47, 255, 0.08)" borderRadius="lg" borderLeft="2px solid #7B2FFF">
          <Text fontSize="sm" color="gray.400">
            <strong>Note:</strong> Stairs/floor surcharge is £5 per floor when no lift (handled in quote). Price lock: 2% of quote, min £5, max £25 (see <Text as="code" fontSize="xs">lib/pricing</Text>).
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
