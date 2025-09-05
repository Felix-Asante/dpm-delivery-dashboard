import { DEFAULT_CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import React from "react";

export function RidersHomeHeader() {
  return (
    <section>
      <h4 className="font-semibold text-lg">Balance</h4>
      <p className="text-gray-500 text-sm">Your remaining income</p>
      <h3 className="text-2xl font-bold my-2">
        {DEFAULT_CURRENCY.symbol} 0.00
      </h3>
      <Button className="rounded-full">Request withdraw</Button>
    </section>
  );
}
