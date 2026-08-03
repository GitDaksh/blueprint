"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose how BluePrint looks on this device.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            onClick={() => setTheme(option.value)}
            className={cn("flex-1 gap-2", theme === option.value && "border-primary text-primary")}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}