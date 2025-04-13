import React from "react";
import CreateRiderSection from "../_sections/CreateRiderSection";

export default function NewRiderPage() {
  return (
    <div className="w-full p-5">
      <h4 className="text-2xl my-5">Add new rider</h4>
      <CreateRiderSection />
    </div>
  );
}
