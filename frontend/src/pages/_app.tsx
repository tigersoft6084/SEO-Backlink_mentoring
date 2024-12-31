import Navbar from "../components/common/Navbar";
import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext"; // Import UserProvider
import "../styles/globals.css"; // Ensure Tailwind is imported

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider>
      <UserProvider> {/* Wrap the app with UserProvider */}
        <Navbar /> {/* Navbar included globally */}
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}
