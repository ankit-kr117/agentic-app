import { useContext } from 'react'
import { ItemsContext, type ItemsStore } from './itemsContext'

export function useItems(): ItemsStore {
  const store = useContext(ItemsContext)
  if (!store) throw new Error('useItems must be used inside <ItemsProvider>')
  return store
}
