'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: data.error ?? 'Registration failed',
          description: data.details ? JSON.stringify(data.details) : undefined,
          status: 'error',
          duration: 5,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Account created',
        description: data.message ?? 'Check your email for a welcome message.',
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

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="#FFB800">
            Create an account
          </Heading>
          <Text color="#EBF1FF">Sign up to book and manage your moves</Text>
        </Box>

        <Box
          p={8}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <form onSubmit={handleRegister}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isDisabled={isLoading}
                />
              </FormControl>

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

              <FormControl isRequired>
                <FormLabel htmlFor="password">Password</FormLabel>
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

              <Button
                type="submit"
                width="full"
                bg="#FFB800"
                color="#06061A"
                isLoading={isLoading}
                fontWeight="bold"
                _hover={{ bg: '#E6A500' }}
              >
                Sign up
              </Button>
            </VStack>
          </form>
        </Box>

        <Text fontSize="sm" color="#EBF1FF" textAlign="center">
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#FFB800', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}
