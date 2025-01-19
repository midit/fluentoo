export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 50,
        padding: '10px 20px',
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 200ms ease-in-out',
        '&:hover': {
          backgroundColor: '#00B74A',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        padding: '1.5rem',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-4px)',
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#005C44',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
