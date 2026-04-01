"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const current = theme ?? "system";
  const CurrentIcon = options.find((o) => o.value === current)?.icon ?? Monitor;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <CurrentIcon className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-11 z-50 bg-[#141012] dark:bg-[#141012] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden min-w-[120px]"
            >
              <div className="p-1">
                {options.map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start h-9 gap-2.5 rounded-lg text-sm ${
                      current === opt.value
                        ? "bg-red-500/15 text-red-400 dark:text-red-400"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setTheme(opt.value);
                      setOpen(false);
                    }}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
