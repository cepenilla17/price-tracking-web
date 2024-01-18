import { ThemeProvider, createTheme } from '@mui/material/styles';
import PriceTracker from "./pages/tracker"
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: "#334897",
    },
    secondary: {
      main: "#FFE500",
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PriceTracker />
    </ThemeProvider>
    
  )
}

export default App
