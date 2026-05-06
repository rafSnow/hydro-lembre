"use client";

import React, { useState } from "react";
import { subDays, startOfMonth, endOfMonth, isAfter, isBefore } from "date-fns";
import { toDateString } from "@/lib/utils/dateUtils";

export type Period = "7d" | "30d" | "current-month" | "custom";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period, from: string, to: string) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [customFrom, setCustomFrom] = useState(toDateString(subDays(new Date(), 7)));
  const [customTo, setCustomTo] = useState(toDateString(new Date()));

  const handlePeriodChange = (newPeriod: Period) => {
    let from = "";
    let to = toDateString(new Date());

    switch (newPeriod) {
      case "7d":
        from = toDateString(subDays(new Date(), 6));
        break;
      case "30d":
        from = toDateString(subDays(new Date(), 29));
        break;
      case "current-month":
        from = toDateString(startOfMonth(new Date()));
        to = toDateString(endOfMonth(new Date()));
        break;
      case "custom":
        from = customFrom;
        to = customTo;
        break;
    }

    onChange(newPeriod, from, to);
  };

  const handleCustomDateChange = (type: "from" | "to", date: string) => {
    let newFrom = customFrom;
    let newTo = customTo;

    if (type === "from") {
      newFrom = date;
      // Validação: "até" deve ser >= "de"
      if (isAfter(new Date(date), new Date(newTo))) {
        newTo = date;
      }
    } else {
      newTo = date;
      // Validação: "de" deve ser <= "até"
      if (isBefore(new Date(date), new Date(newFrom))) {
        newFrom = date;
      }
    }

    setCustomFrom(newFrom);
    setCustomTo(newTo);
    onChange("custom", newFrom, newTo);
  };

  const chips: { label: string; id: Period }[] = [
    { label: "7 dias", id: "7d" },
    { label: "30 dias", id: "30d" },
    { label: "Este mês", id: "current-month" },
    { label: "Personalizado", id: "custom" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => handlePeriodChange(chip.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              value === chip.id
                ? "bg-primary text-white"
                : "bg-surface-light dark:bg-surface-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {value === "custom" && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 ml-1">De</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => handleCustomDateChange("from", e.target.value)}
              className="w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 ml-1">Até</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => handleCustomDateChange("to", e.target.value)}
              className="w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
