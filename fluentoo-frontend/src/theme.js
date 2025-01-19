import { createTheme } from '@mui/material/styles';
import { palette } from './theme/palette';
import { typography } from './theme/typography';
import { components } from './theme/components';

const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export default theme;
