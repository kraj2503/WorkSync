import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { isDark, setIsDark } = useTheme();
  return (
    <div>
      <button
        className={`relative w-16 h-8 rounded-full p-1 duration-300 border ${
          isDark 
            ? "bg-gray-700 border-gray-500" 
            : "bg-gray-300 border-gray-300"
        }`}
        onClick={() => setIsDark(!isDark)}
      >
        <div
          className={`absolute top-0.75 left-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-500 ${
            isDark 
              ? "translate-x-8 bg-black text-blue-400" 
              : "translate-x-0 bg-white text-yellow-500"
          }`}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </div>
      </button>
    </div>
  );
}
