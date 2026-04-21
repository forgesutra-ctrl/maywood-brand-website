import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import AdminAuthGuard from './pages/admin/AdminAuthGuard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminLeads from './pages/admin/AdminLeads'
import AdminPartnerApplications from './pages/admin/AdminPartnerApplications'
import AdminQuotes from './pages/admin/AdminQuotes'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import AdminPlaceholderPage from './pages/admin/AdminPlaceholderPage'
import AboutUs from './pages/AboutUs'
import ExperienceCenters from './pages/ExperienceCenters'
import Home from './pages/Home'
import InstantQuote from './pages/InstantQuote'
import MaywoodFinance from './pages/MaywoodFinance'
import MaywoodManufacturing from './pages/MaywoodManufacturing'
import MaywoodPlys from './pages/MaywoodPlys'
import PartnerProgram from './pages/PartnerProgram'
import Portfolio from './pages/Portfolio'
import ProjectStudio from './pages/ProjectStudio'
import Products from './pages/Products'
import HomeInteriors from './pages/products/HomeInteriors'
import CorporateSpaces from './pages/products/CorporateSpaces'
import SpasSalons from './pages/products/SpasSalons'
import RetailSpaces from './pages/products/RetailSpaces'
import HotelsCafes from './pages/products/HotelsCafes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminAuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="consultations" element={<AdminConsultations />} />
            <Route path="partners" element={<AdminPartnerApplications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="instant-quote" element={<InstantQuote />} />
          <Route path="products" element={<Products />} />
          <Route path="products/home-interiors" element={<HomeInteriors />} />
          <Route path="products/corporate-spaces" element={<CorporateSpaces />} />
          <Route path="products/spas-salons" element={<SpasSalons />} />
          <Route path="products/retail-spaces" element={<RetailSpaces />} />
          <Route path="products/hotels-cafes" element={<HotelsCafes />} />
          <Route path="experience-centers" element={<ExperienceCenters />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="finance" element={<MaywoodFinance />} />
          <Route path="maywood-finance" element={<Navigate to="/finance" replace />} />
          <Route path="manufacturing" element={<MaywoodManufacturing />} />
          <Route path="maywood-manufacturing" element={<Navigate to="/manufacturing" replace />} />
          <Route path="maywood-plys" element={<MaywoodPlys />} />
          <Route path="project-studio" element={<ProjectStudio />} />
          <Route path="partners" element={<PartnerProgram />} />
          <Route path="partner-program" element={<Navigate to="/partners" replace />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="about-us" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
