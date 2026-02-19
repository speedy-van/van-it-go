'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSent(false);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: data.error ?? 'Request failed',
          status: 'error',
          duration: 5,
          isClosable: true,
        });
        return;
      }

      setSent(true);
      toast({
        title: 'Check your email',
        description: data.message,
        status: 'success',
        duration: 5,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="#FFB800">
            Reset your password
          </Heading>
          <Text color="#EBF1FF">
            Enter your email and we’ll send you a link to reset your password. Works for customer, driver, and admin accounts.
          </Text>
        </Box>

        <Box
          p={8}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isDisabled={isLoading}
                />
              </FormControl>

              <Button
                type="submit"
                width="full"
                bg="#FFB800"
                color="#06061A"
                isLoading={isLoading}
                fontWeight="bold"
                _hover={{ bg: '#E6A500' }}
              >
                Send reset link
              </Button>
            </VStack>
          </form>
        </Box>

        {sent && (
          <Text fontSize="sm" color="#90EE90" textAlign="center">
            If an account exists for that email, you’ll receive a link shortly. Check your spam folder if you don’t see it.
          </Text>
        )}

        <Text fontSize="sm" color="#EBF1FF" textAlign="center">
          <Link href="/login" style={{ color: '#FFB800', textDecoration: 'underline' }}>
            Back to sign in
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}
