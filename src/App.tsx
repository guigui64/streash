import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Route, Switch, useLocation } from "wouter";
import { Home } from "./pages/Home";
import { Follow } from "./pages/Follow";
import { Keep } from "./pages/Keep";
import { Start } from "./pages/Start";
import { HomeIcon } from "lucide-react";

const queryClient = new QueryClient();

function App() {
  const [route] = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex flex-col items-center justify-start p-4 gap-4">
        {route !== "/" && (
          <header className="min-w-full flex flex-row items-center justify-start">
            <Link
              href="/"
              className="flex flex-row items-center justify-center gap-2"
            >
              <HomeIcon />
              STREash
            </Link>
          </header>
        )}
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/start">
            <Start />
          </Route>
          <Route path="/keep/:matchId">
            <Keep />
          </Route>
          <Route path="/follow/:matchId">
            <Follow />
          </Route>
          <Route>
            <h1>Not found</h1>
            <Link href="/">Go home</Link>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;
