"use client";

import React from "react";
import { Config } from "../utils/types";

interface ConfigPanelProps {
  config: Config;
  setConfig: (config: Config) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setConfig({
      ...config,
      [name]:
        name === "examDurationHours" ||
        name === "breakTimeMinutes" ||
        name === "shiftsPerDay"
          ? Number(value)
          : value,
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Exam Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={config.startTime}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Exam Duration (hours)</label>
          <input
            type="number"
            name="examDurationHours"
            value={config.examDurationHours}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Break Time (minutes)</label>
          <input
            type="number"
            name="breakTimeMinutes"
            value={config.breakTimeMinutes}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Shifts Per Day</label>
          <input
            type="number"
            name="shiftsPerDay"
            value={config.shiftsPerDay}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            min={1}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
