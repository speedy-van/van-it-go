'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Invalid link',
        description: 'No reset token. Use the link from your email.',
        status: 'warning',
        duration: 5,
        isClosable: true,
      });
    }
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
      return;
    }
    if (password.length < 8) {
      toast({
        title: 'Password must be at least 8 characters',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: data.error ?? 'Reset failed',
          status: 'error',
          duration: 5,
          isClosable: true,
        });
        return;
      }

      setSuccess(true);
      toast({
        title: 'Password updated',
        description: data.message,
        status: 'success',
        duration: 5,
        isClosable: true,
      });
      router.push('/login');
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

  if (!token) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={6}>
          <Heading size="lg" color="#FFB800">
            Invalid reset link
          </Heading>
          <Text color="#EBF1FF" textAlign="center">
            This page requires a valid reset link from your email. Request a new link from the forgot password page.
          </Text>
          <Link href="/forgot-password">
            <Button bg="#FFB800" color="#06061A">
              Request new link
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={6}>
          <Heading size="lg" color="#FFB800">
            Password updated
          </Heading>
          <Text color="#EBF1FF">Redirecting you to sign in...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="#FFB800">
            Set new password
          </Heading>
          <Text color="#EBF1FF">Enter your new password below.</Text>
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
                <FormLabel htmlFor="password">New password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={isLoading}
                  minLength={8}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isDisabled={isLoading}
                  minLength={8}
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
                Update password
              </Button>
            </VStack>
          </form>
        </Box>

        <Text fontSize="sm" color="#EBF1FF" textAlign="center">
          <Link href="/login" style={{ color: '#FFB800', textDecoration: 'underline' }}>
            Back to sign in
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}
