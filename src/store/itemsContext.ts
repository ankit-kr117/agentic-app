import { createContext } from 'react'
import type { Item, Kind } from '../types'

export interface NewItemInput {
  kind: Kind
  name: string
  deadline: string | null
  daily: boolean
}

export interface ItemsStore {
  items: Item[]
  /** true if the browser refused to save the latest change */
  saveFailed: boolean
  getItem: (id: string) => Item | undefined
  addItem: (input: NewItemInput) => Item
  startTimer: (id: string) => void
  pauseTimer: (id: string) => void
  resumeTimer: (id: string) => void
  discardTimer: (id: string) => void
  /** Finishes the running session and saves it as a checkpoint with these answers. */
  saveCheckpoint: (id: string, answers: Record<string, string>) => void
}

export const ItemsContext = createContext<ItemsStore | null>(null)
