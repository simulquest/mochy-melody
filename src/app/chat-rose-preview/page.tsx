'use client';

import { useState } from 'react';
import ChatRoseFavicon from '@/components/favicon/ChatRoseFavicon';

export default function ChatRosePreviewPage() {
  const [size, setSize] = useState(350);
  const [furLength, setFurLength] = useState(0.55);
  const [furDensity, setFurDensity] = useState(0.95);
  const [baseStrands, setBaseStrands] = useState(4500);
  const [bodyColor, setBodyColor] = useState('#d02bbd');
  const [eyeColor, setEyeColor] = useState('#231a2b');

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center">
            <span className="text-fuchsia-600 font-bold text-sm">🐱</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Chat Rose</h1>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Aperçu favicon • fond blanc • sans mouvement
        </p>
      </header>

      <div className="flex-1 flex">
        {/* Colonne gauche : contrôles */}
        <aside className="w-72 border-r border-gray-200 bg-gray-50/50 p-6 overflow-y-auto shrink-0 z-10">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Réglages</h2>

          <SliderControl
            label="Taille du chat"
            value={size}
            min={150}
            max={800}
            step={50}
            unit=" px"
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
          />

          <SliderControl
            label="Longueur du pelage"
            value={furLength}
            min={0.55}
            max={1.7}
            step={0.05}
            unit=""
            onChange={(e) => setFurLength(parseFloat(e.target.value))}
          />

          <SliderControl
            label="Densité du pelage"
            value={furDensity}
            min={0.3}
            max={1}
            step={0.05}
            unit=""
            onChange={(e) => setFurDensity(parseFloat(e.target.value))}
          />

          <SliderControl
            label="Nombre de brins (douceur)"
            value={baseStrands}
            min={1500}
            max={8000}
            step={500}
            unit=""
            onChange={(e) => setBaseStrands(parseInt(e.target.value, 10))}
          />

          <div className="mt-8">
            <ColorPickerControl
              label="Couleur du corps"
              value={bodyColor}
              onChange={(v) => setBodyColor(v)}
            />
            <ColorPickerControl
              label="Couleur des yeux"
              value={eyeColor}
              onChange={(v) => setEyeColor(v)}
            />
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Modifiez un réglage : le chat se met à jour en direct.
            </p>
          </div>
        </aside>

        {/* Colonne droite : aperçu du chat */}
        <main className="flex-1 flex items-center justify-center bg-white relative">
          <div className="relative w-full max-w-[600px] max-h-[600px] aspect-square">
            <ChatRoseFavicon
              size={size}
              furLength={furLength}
              furDensity={furDensity}
              baseStrands={baseStrands}
              bodyColor={bodyColor}
              eyeColor={eyeColor}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------- */
/* Sous-composants de contrôle                                                 */
/* --------------------------------------------------------------------------- */

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-xs font-mono font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
      />
    </div>
  );
}

function ColorPickerControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-full cursor-pointer border-0 bg-transparent p-0"
        />
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {value}
        </span>
      </div>
    </div>
  );
}
