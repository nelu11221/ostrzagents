import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import LandingV1 from './pages/LandingV1'
import NotFound from './pages/NotFound'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/v1" element={<LandingV1 />} />
        <Route path="/app/*" element={<Placeholder title="Кабинет (Mini App)" />} />
        <Route path="/admin/*" element={<Placeholder title="Админка" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
