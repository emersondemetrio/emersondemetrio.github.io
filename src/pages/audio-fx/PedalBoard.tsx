import { Effects } from "@/audio.types";
import { Modal } from "@/components/modal/modal";
import { Pedal } from "@/components/pedal/PedalControl";
import React, { useState } from "react";
import { AudioEffects } from "./audio-effects";

type PedalControlProps = {
  name: string;
  enabled: boolean;
  onToggle: () => void;
  color: string;
  children?: React.ReactNode;
};

const PedalControl = ({
  name,
  enabled,
  onToggle,
  color,
  children,
}: PedalControlProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2 h-[135px]">
      <div
        className={`cursor-pointer transition-all duration-200 ${
          enabled ? "scale-100 opacity-100" : "scale-95 opacity-60"
        } hover:scale-105`}
        onClick={onToggle}
      >
        <Pedal
          color={enabled ? color : "#666666"}
          size={120}
          className={`drop-shadow-lg ${enabled ? "drop-shadow-xl" : ""}`}
          onSettingsClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            setShowModal(true);
          }}
          showSettings={showModal}
        />
      </div>
      <div className="text-center">
        <div
          className={`text-sm font-bold ${
            enabled ? "text-primary" : "text-base-content/60"
          }`}
        >
          {name}
        </div>
        {enabled && (
          <div
            className={`w-2 h-2 rounded-full bg-red-500 mx-auto mt-1 ${
              enabled ? "animate-pulse" : ""
            }`}
          />
        )}
      </div>

      <Modal
        title={`${name} Settings`}
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4 py-4">{children}</div>
      </Modal>
    </div>
  );
};

type ControlProps = {
  label: string;
  value: number | string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number | string) => void;
  unit?: string;
  type?: 'slider' | 'select';
  options?: { value: string; label: string }[];
};

const Control = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  type = 'slider',
  options = [],
}: ControlProps) => (
  <div>
    <label className="text-xs text-base-content/70">
      {label}: {type === 'slider' && typeof value === "number" ? value.toFixed(2) : value}
      {unit}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-xs w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range range-xs range-primary w-full"
      />
    )}
  </div>
);

type PedalBoardProps = {
  effects: Effects;
  updateEffect: (effectName: keyof Effects, params: Partial<Effects[keyof Effects]>) => void;
};

export const PedalBoard = ({ effects, updateEffect }: PedalBoardProps) => {
  return (
    <div className="bg-gradient-to-b from-base-300 to-base-200 p-6 rounded-xl shadow-inner">
      <h3 className="text-lg font-bold mb-6 text-center">🎸 Pedalboard</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {AudioEffects.map((effectConfig) => {
          const effect = effects[effectConfig.key];

          return (
            <PedalControl
              key={effectConfig.key}
              name={effectConfig.name}
              color={effectConfig.color}
              enabled={effect.enabled}
              onToggle={() =>
                updateEffect(effectConfig.key, { enabled: !effect.enabled })
              }
            >
              {effectConfig.params.map((param) => (
                <Control
                  key={param.key}
                  label={param.label}
                  value={effect[param.key as keyof typeof effect] as unknown as number | string}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  unit={param.unit}
                  type={param.type}
                  options={param.options}
                  onChange={(value) =>
                    updateEffect(effectConfig.key, { [param.key]: value })
                  }
                />
              ))}
            </PedalControl>
          );
        })}
      </div>
    </div>
  );
};
