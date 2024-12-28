import Navbar from '../components/common/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css'; // Ensure Tailwind is imported

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
