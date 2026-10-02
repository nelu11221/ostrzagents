import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import LandingV1 from './pages/LandingV1'
import NotFound from './pages/NotFound'
import Placeholder from './pages/Placeholder'
import ProductPage from './pages/ProductPage'
import { ScrollManager } from './components/ui/ScrollManager'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/v1" element={<LandingV1 />} />
        <Route path="/leadgen" element={<ProductPage key="leadgen" id="leadgen" />} />
        <Route path="/ai-sales" element={<ProductPage key="sales" id="sales" />} />
        <Route path="/app/*" element={<Placeholder title="Кабинет (Mini App)" />} />
        <Route path="/admin/*" element={<Placeholder title="Админка" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
