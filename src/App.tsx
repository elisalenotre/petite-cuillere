import AppRouter from "./routes/AppRouter";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      {user && <Navbar />}
      <main style={{ paddingTop: user ? "72px" : "0px" }}>
        <AppRouter />
      </main>
    </ThemeProvider>
  );
}