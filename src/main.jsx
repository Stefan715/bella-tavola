import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import './index.css'
import MyOrders from './pages/MyOrders.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/online-order" element={<App />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)