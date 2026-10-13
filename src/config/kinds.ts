import type { Kind } from '../types'

// The three themed names. Rename anything here and the whole app follows.
export interface KindInfo {
  id: Kind
  singular: string
  plural: string
  /** The plain-English meaning, shown in calligraphy above the name. */
  script: string
  blurb: string
}

export const KIND_ORDER: Kind[] = ['mission', 'craft', 'journey']

export const KINDS: Record<Kind, KindInfo> = {
  mission: {
    id: 'mission',
    singular: 'Mission',
    plural: 'Missions',
    script: 'Projects',
    blurb: 'Things you are building',
  },
  craft: {
    id: 'craft',
    singular: 'Craft',
    plural: 'Crafts',
    script: 'Skills',
    blurb: 'Abilities you are sharpening',
  },
  journey: {
    id: 'journey',
    singular: 'Journey',
    plural: 'Journeys',
    script: 'Learning',
    blurb: 'Subjects you are exploring',
  },
}
