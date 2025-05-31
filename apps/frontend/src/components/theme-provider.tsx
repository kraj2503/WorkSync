import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeProviderProps = {
  children: ReactNode;
  defaultDark?: boolean;
  storageKey?: string;
};

type ThemeProviderState = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultDark = true,
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultDark;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(isDark ? "dark" : "light");
    localStorage.setItem(storageKey, JSON.stringify(isDark));
    console.log(isDark);
  }, [isDark]);

  return (
    <ThemeProviderContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
