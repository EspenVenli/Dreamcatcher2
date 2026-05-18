import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stars, Pencil, Plus, Check, Loader, AlertCircle, MapPin, Clock, Calendar } from 'lucide-react';
import { AstrologyProfile, AstroMode, ZodiacSign, FullBirthChart, BirthData } from '../types';
import { apiUrl } from '../api';

// ── Constants ──────────────────────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const PLANETS: { key: keyof Omit<FullBirthChart, 'mc' | 'hasTime'>; label: string; symbol: string }[] = [
  { key: 'sun',       label: 'Sun',        symbol: '☉' },
  { key: 'moon',      label: 'Moon',       symbol: '☽' },
  { key: 'rising',    label: 'Rising',     symbol: '↑' },
  { key: 'mercury',   label: 'Mercury',    symbol: '☿' },
  { key: 'venus',     label: 'Venus',      symbol: '♀' },
  { key: 'mars',      label: 'Mars',       symbol: '♂' },
  { key: 'jupiter',   label: 'Jupiter',    symbol: '♃' },
  { key: 'saturn',    label: 'Saturn',     symbol: '♄' },
  { key: 'uranus',    label: 'Uranus',     symbol: '♅' },
  { key: 'neptune',   label: 'Neptune',    symbol: '♆' },
  { key: 'pluto',     label: 'Pluto',      symbol: '♇' },
  { key: 'northNode', label: 'North Node', symbol: '☊' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SignPicker({ value, onChange }: { value?: ZodiacSign; onChange: (s: ZodiacSign) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {ZODIAC_SIGNS.map(sign => (
        <button
          key={sign}
          type="button"
          onClick={() => onChange(sign)}
          className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-xs transition-all ${
            value === sign
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'bg-surface-container text-on-surface/60 border border-outline-variant/10 hover:bg-surface-container-high'
          }`}
        >
          <span className="text-lg leading-none">{ZODIAC_SYMBOLS[sign]}</span>
          <span className="mt-1 text-[10px] leading-tight">{sign}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface Props {
  astrologyProfile?: AstrologyProfile;
  onSave: (profile: AstrologyProfile) => void;
}

export default function AstrologySection({ astrologyProfile, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [mode, setMode]       = useState<AstroMode>(astrologyProfile?.mode ?? 'sun-sign');
  const [sunSign, setSunSign] = useState<ZodiacSign | undefined>(astrologyProfile?.sunSign);

  // Full-chart birth data form
  const [birthDate,  setBirthDate]  = useState(astrologyProfile?.birthData?.date  ?? '');
  const [birthTime,  setBirthTime]  = useState(astrologyProfile?.birthData?.time  ?? '');
  const [birthPlace, setBirthPlace] = useState(astrologyProfile?.birthData?.place ?? '');
  const [unknownTime, setUnknownTime] = useState(false);

  const [calculating, setCalculating] = useState(false);
  const [calcError,   setCalcError]   = useState<string | null>(null);
  const [calculated,  setCalculated]  = useState<FullBirthChart | undefined>(astrologyProfile?.fullChart);
  const [geocodedPlace, setGeocodedPlace] = useState(astrologyProfile?.birthData?.geocodedPlace);

  const hasData = !!astrologyProfile;

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleCalculate() {
    if (!birthDate || !birthPlace) return;
    setCalculating(true);
    setCalcError(null);
    try {
      const res = await fetch(apiUrl('/api/astrology/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthDate,
          time: unknownTime ? undefined : birthTime || undefined,
          place: birthPlace,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      setCalculated(data.chart);
      setGeocodedPlace(data.geocodedPlace);
    } catch (err: any) {
      setCalcError(err.message ?? 'Something went wrong');
    } finally {
      setCalculating(false);
    }
  }

  function handleSave() {
    if (mode === 'sun-sign') {
      onSave({ mode, sunSign });
    } else {
      if (!calculated) return;
      const bd: BirthData = {
        date: birthDate,
        time: unknownTime ? undefined : birthTime || undefined,
        place: birthPlace,
        geocodedPlace,
      };
      onSave({ mode, birthData: bd, fullChart: calculated });
    }
    setEditing(false);
  }

  const canSave = mode === 'sun-sign' ? !!sunSign : !!calculated;

  // ── Display view ──────────────────────────────────────────────────────────

  const displayView = (
    <section className="space-y-3">
      <div className="flex items-center justify-between ml-1">
        <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40">Astrology</h2>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-xs text-primary/60 hover:text-primary transition-colors"
        >
          {hasData ? <Pencil size={12} /> : <Plus size={12} />}
          <span>{hasData ? 'Edit' : 'Add chart'}</span>
        </button>
      </div>

      {!hasData ? (
        <button
          onClick={() => setEditing(true)}
          className="w-full bg-surface-container-low border border-dashed border-primary/20 rounded-xl px-5 py-5 flex flex-col items-center gap-2 group hover:border-primary/40 transition-colors"
        >
          <Stars size={22} className="text-primary/40 group-hover:text-primary/60 transition-colors" />
          <p className="text-xs text-on-surface/40 group-hover:text-on-surface/60 transition-colors text-center leading-relaxed">
            Add your astrological profile to personalise your dream insights
          </p>
        </button>
      ) : astrologyProfile!.mode === 'sun-sign' ? (
        <div className="bg-surface-container-low px-5 py-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <span className="text-3xl">{astrologyProfile!.sunSign ? ZODIAC_SYMBOLS[astrologyProfile!.sunSign] : '✦'}</span>
          <div>
            <p className="text-[10px] text-on-surface/40 uppercase tracking-widest">Sun Sign</p>
            <p className="text-sm font-medium text-on-surface mt-0.5">{astrologyProfile!.sunSign}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {astrologyProfile!.birthData && (
            <div className="flex items-center gap-2 px-1">
              <MapPin size={10} className="text-on-surface/30" />
              <p className="text-[10px] text-on-surface/40 truncate">{astrologyProfile!.birthData.place}</p>
              {!astrologyProfile!.birthData.time && (
                <span className="text-[9px] text-primary/40 ml-auto">approx. (no birth time)</span>
              )}
            </div>
          )}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
            {PLANETS.filter(p => {
              const key = p.key as keyof FullBirthChart;
              return astrologyProfile!.fullChart?.[key];
            }).map((p, i) => {
              const placement = astrologyProfile!.fullChart![p.key as keyof FullBirthChart] as { sign: ZodiacSign; degree?: number; house?: number } | undefined;
              if (!placement) return null;
              return (
                <div
                  key={p.key}
                  className={`flex items-center justify-between px-4 py-2.5 ${i !== 0 ? 'border-t border-outline-variant/5' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base w-5 text-center text-primary/60">{p.symbol}</span>
                    <span className="text-xs text-on-surface/50">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-on-surface">
                      {ZODIAC_SYMBOLS[placement.sign]} {placement.sign}
                      {placement.degree !== undefined && (
                        <span className="text-on-surface/40 font-normal"> {placement.degree}°</span>
                      )}
                    </span>
                    {placement.house && (
                      <span className="text-[10px] text-on-surface/30 bg-surface-container px-1.5 py-0.5 rounded-full">
                        H{placement.house}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );

  // ── Edit view ─────────────────────────────────────────────────────────────

  const editView = (
    <section className="space-y-4">
      <div className="ml-1">
        <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40">Astrology</h2>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-2">
        {(['sun-sign', 'full-chart'] as AstroMode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setCalculated(undefined); setCalcError(null); }}
            className={`rounded-xl px-4 py-4 text-left transition-all border ${
              mode === m
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-surface-container-low border-outline-variant/10 text-on-surface/60 hover:bg-surface-container-high'
            }`}
          >
            <div className="text-xl mb-1">{m === 'sun-sign' ? '☉' : '✦'}</div>
            <div className="text-xs font-semibold">{m === 'sun-sign' ? 'Sun Sign Only' : 'Full Birth Chart'}</div>
            <div className="text-[10px] opacity-60 mt-0.5 leading-snug">
              {m === 'sun-sign' ? 'Quick — just your star sign' : 'Calculated from birth data'}
            </div>
          </button>
        ))}
      </div>

      {/* ── Sun Sign form ── */}
      {mode === 'sun-sign' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <p className="text-xs text-on-surface/40 ml-1">Select your sun sign</p>
          <SignPicker value={sunSign} onChange={setSunSign} />
        </motion.div>
      )}

      {/* ── Full Chart form ── */}
      {mode === 'full-chart' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-xs text-on-surface/50 ml-1 leading-relaxed">
            Enter your birth details and we'll calculate your full chart automatically.
          </p>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <Calendar size={10} /> Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => { setBirthDate(e.target.value); setCalculated(undefined); }}
              className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors"
            />
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <Clock size={10} /> Time of Birth
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={e => { setBirthTime(e.target.value); setCalculated(undefined); }}
              disabled={unknownTime}
              className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors disabled:opacity-40"
            />
            <label className="flex items-center gap-2 ml-1 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={e => { setUnknownTime(e.target.checked); setCalculated(undefined); }}
                className="rounded border-outline-variant/30 accent-primary"
              />
              <span className="text-[10px] text-on-surface/40">I don't know my birth time</span>
            </label>
            {unknownTime && (
              <p className="text-[10px] text-primary/50 ml-1 leading-relaxed">
                Planets will be accurate, but Rising sign and houses require an exact birth time.
              </p>
            )}
          </div>

          {/* Place */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <MapPin size={10} /> Place of Birth
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={e => { setBirthPlace(e.target.value); setCalculated(undefined); }}
              placeholder="e.g. Oslo, Norway"
              className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface placeholder-on-surface/20 focus:outline-none transition-colors"
            />
          </div>

          {/* Error */}
          {calcError && (
            <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-xs text-error/80">{calcError}</p>
            </div>
          )}

          {/* Calculate button */}
          {!calculated ? (
            <button
              onClick={handleCalculate}
              disabled={!birthDate || !birthPlace || calculating}
              className="w-full py-3.5 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/25 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {calculating ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Calculating your chart…
                </>
              ) : (
                <>
                  <Stars size={14} />
                  Calculate Chart
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              {geocodedPlace && (
                <p className="text-[10px] text-on-surface/30 px-1 leading-snug">
                  📍 {geocodedPlace}
                </p>
              )}
              {!calculated.hasTime && (
                <p className="text-[10px] text-primary/50 px-1">
                  Rising sign and houses not shown (birth time unknown)
                </p>
              )}
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
                {PLANETS.filter(p => {
                  if (p.key === 'rising' && !calculated.hasTime) return false;
                  return true;
                }).map((p, i) => {
                  const pl = calculated[p.key as keyof typeof calculated] as { sign: ZodiacSign; degree?: number; house?: number } | undefined;
                  if (!pl || typeof pl !== 'object' || !('sign' in pl)) return null;
                  return (
                    <div
                      key={p.key}
                      className={`flex items-center justify-between px-4 py-2.5 ${i !== 0 ? 'border-t border-outline-variant/5' : ''}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base w-5 text-center text-primary/60">{p.symbol}</span>
                        <span className="text-xs text-on-surface/50">{p.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-on-surface">
                          {ZODIAC_SYMBOLS[pl.sign]} {pl.sign}
                          {pl.degree !== undefined && (
                            <span className="text-on-surface/40 font-normal"> {pl.degree}°</span>
                          )}
                        </span>
                        {pl.house && (
                          <span className="text-[10px] text-on-surface/30 bg-surface-container px-1.5 py-0.5 rounded-full">
                            H{pl.house}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => { setCalculated(undefined); setCalcError(null); }}
                className="text-[10px] text-on-surface/30 hover:text-on-surface/60 transition-colors ml-1"
              >
                Recalculate with different details
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => { setEditing(false); setCalcError(null); }}
          className="flex-1 py-3 rounded-xl border border-outline-variant/20 text-xs text-on-surface/50 hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 py-3 rounded-xl bg-primary/20 border border-primary/30 text-xs text-primary font-semibold hover:bg-primary/30 transition-colors disabled:opacity-30 flex items-center justify-center gap-1.5"
        >
          <Check size={13} />
          Save
        </button>
      </div>
    </section>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
    >
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {editView}
          </motion.div>
        ) : (
          <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {displayView}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
