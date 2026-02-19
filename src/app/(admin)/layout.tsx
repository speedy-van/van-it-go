'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Link as ChakraLink,
  Text,
  Button,
  Divider,
  Flex,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect } from 'react';

const navSections = [
  {
    label: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Operations',
    links: [
      { href: '/admin/bookings', label: 'Bookings', icon: '📦' },
      { href: '/admin/drivers', label: 'Drivers', icon: '🚐' },
      { href: '/admin/customers', label: 'Customers', icon: '👥' },
      { href: '/admin/invoices', label: 'Invoices', icon: '🧾' },
    ],
  },
  {
    label: 'Business',
    links: [
      { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
      { href: '/admin/pricing', label: 'Pricing', icon: '💰' },
    ],
  },
  {
    label: 'Configuration',
    links: [
      { href: '/admin/content', label: 'Content', icon: '📝' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

function NavItem({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}) {
  return (
    <Link href={href} passHref legacyBehavior>
      <ChakraLink
        display="flex"
        alignItems="center"
        gap={3}
        py={2}
        px={3}
        borderRadius="md"
        bg={isActive ? 'rgba(123, 47, 255, 0.2)' : 'transparent'}
        color={isActive ? '#B794F6' : '#EBF1FF'}
        _hover={{ bg: 'rgba(123, 47, 255, 0.15)', color: '#B794F6' }}
        fontSize="sm"
        fontWeight={isActive ? 600 : 400}
      >
        <Text as="span" fontSize="md">{icon}</Text>
        {label}
      </ChakraLink>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading' || !session) {
    return (
      <Flex minH="100vh" bg="#06061A" align="center" justify="center">
        <Text color="#EBF1FF">Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#06061A" direction={{ base: 'column', md: 'row' }}>
      {/* Sidebar */}
      <Box
        as="nav"
        w={{ base: 'full', md: '260px' }}
        minW={{ md: '260px' }}
        bg="#0F0F2A"
        borderRight={{ md: '1px solid' }}
        borderColor={{ md: 'whiteAlpha.100' }}
        py={4}
        px={3}
      >
        <Flex justify="space-between" align="center" px={3} mb={6}>
          <Text fontWeight="bold" color="#EBF1FF" fontSize="lg">
            Admin
          </Text>
        </Flex>
        <VStack align="stretch" gap={1} spacing={0}>
          {navSections.map((section) => (
            <Box key={section.label}>
              <Text
                px={3}
                py={2}
                fontSize="xs"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {section.label}
              </Text>
              {section.links.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={
                    link.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(link.href)
                  }
                />
              ))}
            </Box>
          ))}
        </VStack>
        <Divider my={4} borderColor="whiteAlpha.100" />
        <Box px={3}>
          <Text fontSize="xs" color="gray.500" mb={2} noOfLines={1}>
            {session.user?.email}
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            w="full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
      {/* Main content */}
      <Box flex={1} overflow="auto" p={6}>
        {children}
      </Box>
    </Flex>
  );
}
