import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import AboutUs from './pages/AboutUs'
import ExperienceCenters from './pages/ExperienceCenters'
import Home from './pages/Home'
import InstantQuote from './pages/InstantQuote'
import MaywoodFinance from './pages/MaywoodFinance'
import MaywoodManufacturing from './pages/MaywoodManufacturing'
import MaywoodPlys from './pages/MaywoodPlys'
import PartnerProgram from './pages/PartnerProgram'
import Products from './pages/Products'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="instant-quote" element={<InstantQuote />} />
          <Route path="products" element={<Products />} />
          <Route path="experience-centers" element={<ExperienceCenters />} />
          <Route path="maywood-finance" element={<MaywoodFinance />} />
          <Route path="maywood-manufacturing" element={<MaywoodManufacturing />} />
          <Route path="maywood-plys" element={<MaywoodPlys />} />
          <Route path="partner-program" element={<PartnerProgram />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
