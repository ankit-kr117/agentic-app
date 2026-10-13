import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ItemPage } from './pages/ItemPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ItemsProvider } from './store/ItemsProvider'

export default function App() {
  return (
    <BrowserRouter>
      <ItemsProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="item/:id" element={<ItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ItemsProvider>
    </BrowserRouter>
  )
}
