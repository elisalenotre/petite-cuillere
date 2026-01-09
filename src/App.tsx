import AppRouter from "./routes/AppRouter";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <main style={{ paddingTop: user ? "72px" : "0px" }}>
        <AppRouter />
      </main>
    </>
  );
}
