'use client';

import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Card,
  CardBody,
  SimpleGrid,
  List,
  ListItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';

const COMPANY_NAME = 'Speedy Van';
const SUPPORT_EMAIL = 'support@speedy-van.co.uk';
const SUPPORT_PHONE = '01202 129746';

export default function AdminSettingsPage() {
  return (
    <Container maxW="full" py={0}>
      <Heading size="lg" mb={2} color="#EBF1FF">
        Settings
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={6}>
        Company and application defaults. These values are used across the site for invoices, contact, and footer.
      </Text>

      <VStack align="stretch" spacing={6}>
        <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Company & contact
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Company name
                </Text>
                <Text color="#EBF1FF" fontWeight="medium">
                  {COMPANY_NAME}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Support email
                </Text>
                <Text color="#EBF1FF" fontWeight="medium">
                  {SUPPORT_EMAIL}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Support phone
                </Text>
                <Text color="#EBF1FF" fontWeight="medium">
                  {SUPPORT_PHONE}
                </Text>
              </Box>
            </SimpleGrid>
            <Text fontSize="xs" color="gray.500" mt={4}>
              To change these, update the constants in the codebase (e.g. invoice view, contact page, footer) or add a settings API and store in the database.
            </Text>
          </CardBody>
        </Card>

        <Card bg="#0F0F2A" borderLeft="4px solid #FFB800">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Where these are used
            </Heading>
            <List spacing={2}>
              <ListItem color="#EBF1FF" display="flex" alignItems="center" gap={2}>
                <Text as="span">📄</Text>
                Invoices – company name, support email and phone on printed invoices
              </ListItem>
              <ListItem color="#EBF1FF" display="flex" alignItems="center" gap={2}>
                <Text as="span">📧</Text>
                Contact page and footer – customer-facing contact details
              </ListItem>
              <ListItem color="#EBF1FF" display="flex" alignItems="center" gap={2}>
                <Text as="span">🧾</Text>
                Admin invoice view – bill-to and footer line
              </ListItem>
            </List>
          </CardBody>
        </Card>

        <Card bg="#0F0F2A" borderLeft="4px solid #7B2FFF">
          <CardBody>
            <Heading size="sm" color="#EBF1FF" mb={4}>
              Other configuration
            </Heading>
            <List spacing={2}>
              <ListItem color="#EBF1FF">
                <Link href="/admin/pricing" passHref legacyBehavior>
                  <ChakraLink color="#B794F6" _hover={{ textDecoration: 'underline' }}>
                    Pricing
                  </ChakraLink>
                </Link>
                {' – base price, per km, service multipliers, bulk discount (see pricing API / lib/pricing).'}
              </ListItem>
              <ListItem color="#EBF1FF">
                Theme and brand colours – configured in <Text as="code" fontSize="xs" bg="whiteAlpha.100" px={1}>src/lib/theme.ts</Text>.
              </ListItem>
              <ListItem color="#EBF1FF">
                Environment variables (e.g. Stripe, DB, NextAuth) – stored in <Text as="code" fontSize="xs" bg="whiteAlpha.100" px={1}>.env.local</Text>. Never commit secrets.
              </ListItem>
            </List>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
