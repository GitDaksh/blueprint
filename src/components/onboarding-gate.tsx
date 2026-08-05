"use client";

import { useEffect, useState } from "react";
import { hasOnboarded } from "@/lib/storage/preferences";
import { OnboardingDialog } from "@/features/onboarding/components/onboarding-dialog";

export function OnboardingGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasOnboarded()) setOpen(true);
  }, []);

  return <OnboardingDialog open={open} onOpenChange={setOpen} />;
}