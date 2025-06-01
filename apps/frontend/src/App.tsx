import Appbar from "./components/Appbar";
import Hero from "./components/Hero";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";

export function App() {
  return (
<>

    <ThemeProvider defaultDark={false} storageKey="vite-ui-theme">
      <main className="">
        <Appbar />
        
        <Hero user={"user"}/>
      </main>
    </ThemeProvider>
</>
  );
}

export default App;
