export type PhaseLabel = 'inhale' | 'hold' | 'exhale' | 'hold2';
export type Goal = 'calm' | 'focus' | 'energy' | 'sleep' | 'daily';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Phase {
  label: PhaseLabel;
  duration: number;
  instruction?: string;
}

export interface Technique {
  id: string;
  name: string;
  tagline: string;
  difficulty: Difficulty;
  goals: Goal[];
  phases: Phase[];
  defaultRounds: number;
  color: string;
  emoji: string;
  overview: string;
  mechanism: string;
  science: string;
  bestFor: string[];
  contraindications?: string;
  tips: string[];
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'cyclic-sighing',
    name: 'Cyclic Sighing',
    tagline: 'Fastest stress relief — backed by Stanford',
    difficulty: 'beginner',
    goals: ['calm', 'daily'],
    phases: [
      { label: 'inhale', duration: 2, instruction: 'Inhale through nose' },
      { label: 'hold', duration: 1, instruction: 'Quick extra sniff — fill lungs fully' },
      { label: 'exhale', duration: 5, instruction: 'Long, slow exhale through mouth' },
    ],
    defaultRounds: 20,
    color: '#14B8A6',
    emoji: '🌊',
    overview: 'A double inhale followed by a long exhale. A 2023 Stanford study found just 5 minutes per day reduced stress and improved mood more than mindfulness meditation, box breathing, or any other technique tested.',
    mechanism: 'The double inhale reinflates collapsed air sacs in your lungs, maximizing gas exchange. The long exhale dumps CO₂ most efficiently and activates the parasympathetic nervous system via baroreceptors in your heart.',
    science: 'Published in Cell Reports Medicine (2023): Cyclic sighing for 5 min/day showed the greatest reduction in anxiety and most sustained improvement in positive mood — measured daily across one month. Effect grew stronger over time.',
    bestFor: ['Immediate stress relief', 'Anxiety spike', 'Quick mid-day reset', 'Before difficult conversations', 'Daily morning practice'],
    tips: ['On the second inhale, sniff a little extra even when lungs feel full', 'Make the exhale as slow as comfortable', 'Even 1–2 cycles produces a measurable effect'],
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic Breathing',
    tagline: 'The foundation — retrain your default breath',
    difficulty: 'beginner',
    goals: ['calm', 'daily'],
    phases: [
      { label: 'inhale', duration: 4, instruction: 'Breathe into your belly, not chest' },
      { label: 'exhale', duration: 6, instruction: 'Let the belly fall naturally' },
    ],
    defaultRounds: 15,
    color: '#22C55E',
    emoji: '🌿',
    overview: 'Deep belly breathing using your diaphragm. Most adults have drifted into shallow chest breathing — this retrains the default pattern and is the foundation for every other technique.',
    mechanism: 'Activates the vagus nerve, which runs from the brain through the lungs to the gut. Vagal stimulation triggers the parasympathetic response: lower heart rate, reduced cortisol, calmer mind. The extended exhale deepens this effect.',
    science: 'Supported by hundreds of studies across 60+ years. Recommended by the American Lung Association, Johns Hopkins Medicine, and the U.S. military as the foundational breathing practice.',
    bestFor: ['Beginners', 'Chronic stress management', 'Building a daily practice', 'Better sleep quality', 'Post-exercise recovery'],
    tips: ['Place one hand on belly, one on chest — the belly hand should rise, chest should stay still', 'Breathe through your nose on the inhale', 'A longer exhale than inhale amplifies the calming effect'],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    tagline: 'Navy SEAL focus & stress control',
    difficulty: 'intermediate',
    goals: ['focus', 'calm'],
    phases: [
      { label: 'inhale', duration: 4 },
      { label: 'hold', duration: 4 },
      { label: 'exhale', duration: 4 },
      { label: 'hold2', duration: 4 },
    ],
    defaultRounds: 8,
    color: '#3B82F6',
    emoji: '⬜',
    overview: 'Four equal phases of 4 seconds — inhale, hold, exhale, hold — forming a square. Used by Navy SEALs, surgeons, and elite athletes to stay calm and focused under pressure.',
    mechanism: 'Equal-ratio breathing creates nervous system equilibrium. The breath retention phases build CO₂ tolerance (higher tolerance = less anxiety). The systematic pattern activates the prefrontal cortex for calm, rational decision-making.',
    science: 'A 2023 Stanford Cell Reports Medicine study found box breathing produced significantly greater mood improvements and respiratory rate reductions than mindfulness meditation. The military uses it as standard protocol for acute stress.',
    bestFor: ['High-pressure situations', 'Before presentations', 'Acute stress or panic', 'Regaining focus mid-task', 'Pre-performance preparation'],
    tips: ['Visualize tracing a square', 'Start at 4 seconds per side; advanced: 6 or 8', 'The hold after exhale is the most powerful phase', 'Breathe through your nose'],
  },
  {
    id: 'breathing-478',
    name: '4-7-8 Breathing',
    tagline: 'The sleep switch — Dr. Weil\'s signature technique',
    difficulty: 'intermediate',
    goals: ['sleep', 'calm'],
    phases: [
      { label: 'inhale', duration: 4, instruction: 'Inhale quietly through nose' },
      { label: 'hold', duration: 7, instruction: 'Hold completely still' },
      { label: 'exhale', duration: 8, instruction: 'Exhale fully through mouth' },
    ],
    defaultRounds: 6,
    color: '#8B5CF6',
    emoji: '🌙',
    overview: 'Inhale 4, hold 7, exhale 8. Developed by Dr. Andrew Weil, sometimes called a "natural tranquilizer." The extended hold and long exhale make it one of the strongest parasympathetic activators available.',
    mechanism: 'The 7-second hold allows the lungs to fully absorb oxygen and builds CO₂, triggering parasympathetic dominance. The 8-second exhale (twice the inhale) strongly activates the vagus nerve, pulling the body into deep rest mode.',
    science: 'A 2022 Physiological Reports study showed significant HRV improvements and blood pressure reduction. The mechanism is well-supported; Weil has recommended it for sleep and anxiety for decades.',
    bestFor: ['Falling asleep', 'Acute anxiety attacks', 'Post-stressful event recovery', 'Calming anger', 'Pre-surgery anxiety'],
    contraindications: 'The 7-second hold can feel intense for beginners. Maximum 4 rounds. Not recommended for those with respiratory conditions without guidance.',
    tips: ['Start with max 4 rounds — the effect is powerful', 'If 7-second hold is too intense, try 4-5-7 first', 'Practice at the same time each night to build the association with sleep'],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    tagline: 'Maximize HRV — the nervous system\'s best workout',
    difficulty: 'intermediate',
    goals: ['daily', 'calm'],
    phases: [
      { label: 'inhale', duration: 5, instruction: 'Slow, smooth inhale through nose' },
      { label: 'exhale', duration: 5, instruction: 'Slow, smooth exhale through nose' },
    ],
    defaultRounds: 24,
    color: '#06B6D4',
    emoji: '〰️',
    overview: 'Exactly 6 breaths per minute — inhale 5, exhale 5. Featured in James Nestor\'s "Breath" as the single most important breathing practice. Consistently produces the highest heart rate variability of any breathing pattern.',
    mechanism: 'At exactly 6 breaths/minute, the breathing cycle synchronizes with the cardiovascular system\'s natural oscillation (Mayer waves), creating resonance. This maximizes HRV — the measure of your nervous system\'s flexibility.',
    science: 'Multiple RCTs show 20 min/day for 4 weeks improved cognition, reduced anxiety and depression, and reduced stress. Particularly well-studied for PTSD, burnout, and chronic anxiety.',
    bestFor: ['Daily baseline practice', 'Long-term nervous system training', 'Chronic anxiety management', 'Meditation preparation', 'HRV optimization'],
    tips: ['Both inhale and exhale through the nose', 'Breath should be smooth and even', 'Even 5 min produces measurable HRV improvement; 20 min is the research dose', 'Worth practicing every single day'],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    tagline: 'Balance hemispheres — ancient yogic clarity',
    difficulty: 'intermediate',
    goals: ['focus', 'calm'],
    phases: [
      { label: 'inhale', duration: 4, instruction: 'Inhale through LEFT nostril (close right)' },
      { label: 'hold', duration: 2 },
      { label: 'exhale', duration: 4, instruction: 'Exhale through RIGHT nostril (close left)' },
      { label: 'hold2', duration: 2, instruction: 'Inhale right, switch, exhale left — repeat' },
    ],
    defaultRounds: 10,
    color: '#F59E0B',
    emoji: '☯️',
    overview: 'Alternating breath through left and right nostrils — the yogic practice called Nadi Shodhana. Research suggests it may balance left/right brain hemisphere activity and produce mental calm.',
    mechanism: 'Each nostril preferentially stimulates the opposite brain hemisphere. The alternating pattern may balance these, producing clarity. Traditional practitioners use it as preparation for meditation.',
    science: 'Studies show changes in hemispheric EEG patterns. A 2013 Journal of Clinical Diagnostic Research study found significant improvements in spatial memory and attention.',
    bestFor: ['Pre-meditation', 'Mental fatigue or brain fog', 'Cognitive clarity', 'Before creative work', 'Yoga practice'],
    tips: ['Use right hand: thumb closes right nostril, ring finger closes left', 'Even just 5 rounds before work can sharpen focus', 'Breathe gently — no forcing'],
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    tagline: 'Controlled power breathing — energy & resilience',
    difficulty: 'advanced',
    goals: ['energy'],
    phases: [
      { label: 'inhale', duration: 2, instruction: 'Powerful, full inhale — belly to chest' },
      { label: 'exhale', duration: 2, instruction: 'Passive, relaxed exhale — let it fall out' },
    ],
    defaultRounds: 30,
    color: '#EF4444',
    emoji: '🔥',
    overview: 'Rapid, deep breathing cycles followed by breath retention. The most energizing technique — often described as a "legal high." One full session takes 15–20 minutes including rest periods.',
    mechanism: 'Rapid deep breathing causes controlled hyperventilation: CO₂ drops, blood alkalizes, adrenaline surges. Creates a hormetic stress response — your immune and inflammation systems are briefly activated and strengthen.',
    science: 'A landmark 2014 PNAS study showed WHM practitioners could voluntarily influence their immune response to bacterial endotoxin — first evidence of voluntary nervous system control. Anti-inflammatory effects confirmed in 2023 review.',
    bestFor: ['Morning energy boost', 'Pre-workout', 'Cold exposure prep', 'Mental resilience training', 'Breaking through low energy'],
    contraindications: '⚠️ NEVER practice near water, while driving, or standing. Lightheadedness and tingling are normal; passing out is a real risk. Not for cardiovascular conditions, high blood pressure, epilepsy, or pregnancy.',
    tips: ['Always do this lying down or seated safely', 'The exhale is passive — just let air fall out', 'After 30 breaths: exhale and hold as long as comfortable', 'Start with just 1 round'],
  },
  {
    id: 'custom',
    name: 'Custom Breathing',
    tagline: 'Your own timing — personalized practice',
    difficulty: 'beginner',
    goals: ['calm', 'focus', 'energy', 'sleep', 'daily'],
    phases: [
      { label: 'inhale', duration: 4 },
      { label: 'hold', duration: 0 },
      { label: 'exhale', duration: 6 },
      { label: 'hold2', duration: 0 },
    ],
    defaultRounds: 10,
    color: '#6366F1',
    emoji: '🎛️',
    overview: 'Set your own timing for each phase. Use this to experiment with variations of other techniques or dial in the rhythm that feels perfect for you.',
    mechanism: 'The ratio of inhale to exhale drives the nervous system response. Longer exhales = more parasympathetic (calming). Equal ratios = balanced. Longer inhales = more sympathetic (energizing).',
    science: 'The science of breath is fundamentally about ratios and rate. Exhale-dominant ratios consistently activate the parasympathetic system. Start with 1:2 inhale-to-exhale for strong relaxation.',
    bestFor: ['Experienced practitioners', 'Personalizing techniques', 'Experimenting with ratios', 'Any situation'],
    tips: ['Rule: exhale longer than inhale for relaxation', 'Equal in/out for focus', 'Start with 0 for holds', 'Good ratios: 4:6 (calm), 4:4 (focus), 5:5 (coherent), 4:7:8 (sleep)'],
  },
];

export const GOAL_MAP: Record<Goal, string[]> = {
  calm: ['cyclic-sighing', 'diaphragmatic', 'coherent', 'box-breathing'],
  focus: ['box-breathing', 'alternate-nostril', 'coherent'],
  energy: ['wim-hof', 'diaphragmatic'],
  sleep: ['breathing-478', 'coherent', 'diaphragmatic'],
  daily: ['coherent', 'cyclic-sighing', 'diaphragmatic'],
};

export const GOAL_META: Record<Goal, { emoji: string; label: string; description: string }> = {
  calm: { emoji: '😌', label: 'Calm', description: 'Reduce stress or anxiety' },
  focus: { emoji: '🎯', label: 'Focus', description: 'Sharpen concentration' },
  energy: { emoji: '⚡', label: 'Energize', description: 'Boost energy and alertness' },
  sleep: { emoji: '😴', label: 'Sleep', description: 'Wind down and fall asleep' },
  daily: { emoji: '💚', label: 'Daily Practice', description: 'Build a long-term habit' },
};

export function getTechniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find(t => t.id === id);
}

export function getTechniquesForGoal(goal: Goal): Technique[] {
  return GOAL_MAP[goal].map(id => TECHNIQUES.find(t => t.id === id)!).filter(Boolean);
}

export function getCycleDuration(t: Technique): number {
  return t.phases.filter(p => p.duration > 0).reduce((sum, p) => sum + p.duration, 0);
}

export function getRoundsForDuration(t: Technique, minutes: number): number {
  return Math.max(1, Math.round((minutes * 60) / getCycleDuration(t)));
}
