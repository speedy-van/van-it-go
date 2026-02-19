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
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const message =
          result.error === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : result.error;
        toast({
          title: 'Login Failed',
          description: message,
          status: 'error',
          duration: 5,
          isClosable: true,
        });
      } else if (result?.ok) {
        toast({
          title: 'Success',
          description: 'Logged in successfully',
          status: 'success',
          duration: 2,
          isClosable: true,
        });
        router.push('/admin');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
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
          <Heading size="lg" mb={2}>
            VanItGo Admin
          </Heading>
          <Text color="#EBF1FF">Sign in to your account</Text>
        </Box>

        <Box
          p={8}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isDisabled={isLoading}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={isLoading}
                  required
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
                Sign In
              </Button>

              <Text fontSize="sm">
                <Link href="/forgot-password" style={{ color: '#FFB800', textDecoration: 'underline' }}>
                  Forgot password?
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>

        <Text fontSize="xs" color="#EBF1FF" textAlign="center">
          This is a demo login. In production, use secure OAuth providers.
        </Text>
      </VStack>
    </Container>
  );
}
