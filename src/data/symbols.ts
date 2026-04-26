/**
 * Built-in dream-symbol dictionary. Used as a fallback when AI lookups
 * are unavailable, and as the seed for the Symbol Encyclopedia modal.
 *
 * Meanings draw from broadly-known Jungian and cultural readings — they
 * are evocative starting points, not clinical diagnoses.
 */
export interface SymbolEntry {
  name: string;
  short: string;
  long: string;
  emoji?: string;
}

const ENTRIES: SymbolEntry[] = [
  { name: 'Flying',      short: 'Freedom, transcendence, escape from constraint.',                        long: 'Flying often arrives when the psyche is testing the boundaries of what feels possible. It can express liberation, ambition, or a desire to rise above a current pressure. The texture matters: effortless flight points toward integration, while struggling flight may signal ambivalence about the freedom you’re reaching for.',  emoji: '🕊️' },
  { name: 'Falling',     short: 'Loss of control, surrender, fear of failure.',                          long: 'Falling dreams frequently surface during life transitions. They invite you to notice where you’re bracing — what you’re afraid of letting go of — and to ask whether the descent might actually be the beginning of something new.', emoji: '🪂' },
  { name: 'Water',       short: 'Emotion, the unconscious, deep currents.',                              long: 'Water mirrors the emotional body. Calm water suggests integrated feeling; storms suggest pressure seeking release. Whether you’re above, beside, or beneath it tells you how close you are to the feelings underneath.', emoji: '🌊' },
  { name: 'Stars',       short: 'Guidance, fate, far-off ideals.',                                       long: 'Stars are the dreamer’s compass — they point toward something distant but trustworthy. A star-filled sky often appears when you need to remember a longer arc than the one you’re currently inside.', emoji: '✨' },
  { name: 'Observatory', short: 'Watching, perspective, seeing the unseen.',                             long: 'An observatory is the architecture of attention. Dreaming of one suggests a part of you is gathering data — observing your life from a vantage point you don’t usually inhabit.', emoji: '🔭' },
  { name: 'Mirror',      short: 'Self-reflection, identity, the shadow self.',                           long: 'Mirrors return the gaze. What you see (or fail to see) hints at the part of yourself currently asking for acknowledgement.', emoji: '🪞' },
  { name: 'Door',        short: 'Threshold, choice, transformation.',                                     long: 'Doors mark in-betweens. Open doors invite a step forward; locked ones ask what you’re not yet ready for.', emoji: '🚪' },
  { name: 'Key',         short: 'Access, secrets, latent potential.',                                    long: 'A key in a dream usually appears when something inside you is ready to be unlocked — the question is which lock.', emoji: '🗝️' },
  { name: 'House',       short: 'The self, psyche, internal architecture.',                              long: 'Houses are maps of the self — basements hold the unconscious, attics the spiritual, and unexplored rooms reveal capacities you haven’t yet claimed.', emoji: '🏠' },
  { name: 'Forest',      short: 'The unknown, intuition, the wild self.',                                long: 'Forests are unmapped territory. Getting lost in one usually precedes finding a part of yourself you couldn’t locate any other way.', emoji: '🌲' },
  { name: 'Mountain',    short: 'Aspiration, challenge, perspective.',                                   long: 'Mountains rise when something demanding is ahead. Climbing one in a dream is rarely literal — it’s the inner ascent the psyche is rehearsing.', emoji: '⛰️' },
  { name: 'Ocean',       short: 'Vastness, the collective unconscious.',                                 long: 'The ocean is the largest emotional body — it holds what you alone can’t carry. Standing at its edge is often a sign of awe meeting humility.', emoji: '🌊' },
  { name: 'Snake',       short: 'Transformation, healing, hidden knowledge.',                            long: 'Snakes shed skins. They appear when you’re moving through a renewal you may not yet have words for — feared or welcomed, the change is already underway.', emoji: '🐍' },
  { name: 'Bird',        short: 'Spirit, message, perspective.',                                         long: 'Birds carry word from elsewhere. Their colour and behaviour often hint at the kind of message arriving.', emoji: '🐦' },
  { name: 'Fire',        short: 'Passion, destruction, purification.',                                   long: 'Fire is creative force unleashed. Whether warming or consuming, it points toward energy that wants to be metabolised — not suppressed.', emoji: '🔥' },
  { name: 'Light',       short: 'Awareness, clarity, the divine.',                                       long: 'Light shows up where consciousness is expanding. Its quality — soft, blinding, distant — tells you what kind of clarity you’re ready for.', emoji: '💡' },
  { name: 'Moon',        short: 'Cycles, intuition, hidden feeling.',                                    long: 'The moon governs subtler tides — feelings, memory, the not-quite-said. Its phase in a dream often mirrors your own.', emoji: '🌙' },
  { name: 'Sun',         short: 'Vitality, the conscious self, illumination.',                           long: 'The sun is the daylight self. Its presence — rising, setting, eclipsed — speaks to where your active energy is right now.', emoji: '☀️' },
  { name: 'Cloud',       short: 'Confusion, dreaming, transition.',                                       long: 'Clouds soften the boundary between sky and ground. In dreams they often mark the passage between certainty and possibility.', emoji: '☁️' },
  { name: 'Storm',       short: 'Conflict, breakthrough, emotional release.',                            long: 'Storms gather unspent feeling. Surviving one in a dream often coincides with metabolising something you couldn’t fully feel awake.', emoji: '⛈️' },
  { name: 'Tree',        short: 'Growth, rootedness, the self over time.',                               long: 'Trees hold time. Their state — flourishing, leafless, felled — reflects something about your own continuity right now.', emoji: '🌳' },
  { name: 'Path',        short: 'Direction, journey, choice.',                                           long: 'A path is the dream’s way of asking: where are you going, and who chose this route?', emoji: '🛤️' },
  { name: 'Bridge',      short: 'Connection, transition, the in-between.',                               long: 'Bridges link what was once separate. Crossing one in a dream is rarely arbitrary — something on the far side is calling.', emoji: '🌉' },
  { name: 'Animal',      short: 'Instinct, primal energy, untamed truth.',                               long: 'Animals carry the parts of the self too honest for the daylight social self. The kind of animal often points to which instinct is asking for attention.', emoji: '🦊' },
  { name: 'Child',       short: 'Innocence, the inner child, beginnings.',                               long: 'Children in dreams often represent your earliest, least-defended self — and the reparative attention it’s ready to receive.', emoji: '🧒' },
  { name: 'Stranger',    short: 'The unknown self, the shadow.',                                         long: 'Strangers are usually projections of the parts of you not yet introduced to consciousness. Their tone tells you how welcoming you’re being to them.', emoji: '🚶' },
  { name: 'Voice',       short: 'Inner knowing, conscience, summons.',                                   long: 'A disembodied voice in a dream often speaks for the deeper self. Its message tends to be more reliable than its source seems.', emoji: '🗣️' },
  { name: 'Time',        short: 'Mortality, urgency, the felt sense of pace.',                           long: 'Clocks, deadlines, sunrises — when time becomes a character in a dream, the psyche is asking you to notice your relationship to it.', emoji: '⏳' },
];

const BY_NAME: Record<string, SymbolEntry> = ENTRIES.reduce((m, s) => {
  m[s.name.toLowerCase()] = s;
  return m;
}, {} as Record<string, SymbolEntry>);

export function lookupSymbol(name: string): SymbolEntry {
  const hit = BY_NAME[name.toLowerCase().trim()];
  if (hit) return hit;
  // Heuristic fallback for novel symbols.
  return {
    name,
    short: 'A personal motif unique to your dreamscape.',
    long: `“${name}” doesn’t appear in the built-in dictionary. Treat it as a personal symbol — what does it bring up for you, and where else has it surfaced in your life lately?`,
  };
}

export const ALL_SYMBOLS = ENTRIES;
