"use client";

import React from "react";
import { useProtectRoute } from "@/providers/session-provider";

export const CartClient = () => {
  const { isLoading } = useProtectRoute();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-[#727272] text-sm">Fitur keranjang sedang dalam pengembangan.</p>
    </div>
  );
};
