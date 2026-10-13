import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { makeId } from '../lib/id'
import { STORAGE_KEY, loadItems, saveItems } from '../lib/storage'
import { toDateKey } from '../lib/dates'
import { elapsedMs, pausedTimer, resumedTimer, startedTimer } from '../lib/timer'
import type { Item } from '../types'
import { ItemsContext, type ItemsStore, type NewItemInput } from './itemsContext'

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(() => loadItems())
  const [saveFailed, setSaveFailed] = useState(false)
  const skipFirstSave = useRef(true)

  // Save to localStorage whenever items change (but not on first load).
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }
    setSaveFailed(!saveItems(items))
  }, [items])

  // If another tab changes the data, pick it up.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setItems(loadItems())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateItem = useCallback((id: string, change: (item: Item) => Item) => {
    setItems((prev) => prev.map((item) => (item.id === id ? change(item) : item)))
  }, [])

  const getItem = useCallback((id: string) => items.find((item) => item.id === id), [items])

  const addItem = useCallback((input: NewItemInput): Item => {
    const item: Item = {
      id: makeId(),
      kind: input.kind,
      name: input.name.trim(),
      createdAt: Date.now(),
      deadline: input.deadline,
      daily: input.daily,
      timer: null,
      checkpoints: [],
    }
    setItems((prev) => [item, ...prev])
    return item
  }, [])

  const startTimer = useCallback(
    (id: string) => {
      const now = Date.now()
      updateItem(id, (item) => (item.timer ? item : { ...item, timer: startedTimer(now) }))
    },
    [updateItem],
  )

  const pauseTimer = useCallback(
    (id: string) => {
      const now = Date.now()
      updateItem(id, (item) => (item.timer ? { ...item, timer: pausedTimer(item.timer, now) } : item))
    },
    [updateItem],
  )

  const resumeTimer = useCallback(
    (id: string) => {
      const now = Date.now()
      updateItem(id, (item) => (item.timer ? { ...item, timer: resumedTimer(item.timer, now) } : item))
    },
    [updateItem],
  )

  const discardTimer = useCallback(
    (id: string) => updateItem(id, (item) => ({ ...item, timer: null })),
    [updateItem],
  )

  const saveCheckpoint = useCallback(
    (id: string, answers: Record<string, string>) => {
      const now = Date.now()
      const checkpointId = makeId()
      updateItem(id, (item) => {
        if (!item.timer) return item
        return {
          ...item,
          timer: null,
          checkpoints: [
            ...item.checkpoints,
            {
              id: checkpointId,
              dateKey: toDateKey(now),
              savedAt: now,
              durationMs: elapsedMs(item.timer, now),
              answers,
            },
          ],
        }
      })
    },
    [updateItem],
  )

  const value = useMemo<ItemsStore>(
    () => ({
      items,
      saveFailed,
      getItem,
      addItem,
      startTimer,
      pauseTimer,
      resumeTimer,
      discardTimer,
      saveCheckpoint,
    }),
    [items, saveFailed, getItem, addItem, startTimer, pauseTimer, resumeTimer, discardTimer, saveCheckpoint],
  )

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
}
