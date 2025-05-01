"use client";
import { ShipmentStatusOptions } from "@/config/constants/data";
import { Tab, Tabs } from "@nextui-org/react";
import { useQueryState } from "nuqs";

export function Filters() {
  const [tab, setTab] = useQueryState("status", { shallow: false });
  return (
    <div>
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider px-5",
          cursor: "w-full bg-primary",
          tab: "max-w-fit w-full px-0 h-12",
          tabContent: " group-data-[selected=true]:text-primary",
          base: "w-full",
        }}
        color="primary"
        variant="underlined"
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key.toString())}
      >
        {ShipmentStatusOptions.map((status) => (
          <Tab
            key={status.value}
            title={
              <div className="flex items-center space-x-2">
                <span>{status.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
