import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#F0EFFF',
      100: '#E0DEFF',
      200: '#C1BDFF',
      300: '#A39CFF',
      400: '#847BFF',
      500: '#7B2FFF',
      600: '#6B00FF',
      700: '#5D00E0',
      800: '#4F00C1',
      900: '#3D00A3',
    },
    surface: {
      dark: '#0F0F2A',
      darker: '#06061A',
    },
    cta: '#FFB800',
    text: {
      light: '#F0EFFF',
      dark: '#0D1117',
    },
  },
  styles: {
    global: {
      'html, body': {
        background: '#06061A',
        color: '#F0EFFF',
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: '1.6',
        scrollBehavior: 'smooth',
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*': {
          animation: 'none !important',
          transition: 'none !important',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: '999px',
        transition: 'all 0.2s ease',
      },
      variants: {
        solid: {
          bg: '#FFB800',
          color: '#06061A',
          _hover: {
            bg: '#E6A500',
            transform: 'translateY(-2px)',
            boxShadow: '0 0 40px -8px rgba(123,47,255,0.4)',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: '#7B2FFF',
          color: '#7B2FFF',
          _hover: {
            bg: 'rgba(123, 47, 255, 0.1)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: '#0F0F2A',
        borderRadius: '10px',
        border: '1px solid rgba(123, 47, 255, 0.2)',
      },
    },
  },
  fonts: {
    heading: 'Plus Jakarta Sans, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '10px',
    xl: '16px',
    full: 'full',
  },
  shadows: {
    base: '0 0 40px -8px rgba(123,47,255,0.08)',
    md: '0 0 40px -8px rgba(123,47,255,0.12)',
    lg: '0 0 40px -8px rgba(123,47,255,0.20)',
    xl: '0 0 40px -8px rgba(123,47,255,0.40)',
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
});
