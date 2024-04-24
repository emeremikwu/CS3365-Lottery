import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import Home from './components/Home'
import Catalog from './components/Catalog'
import PastNumbers from './components/PastNumbers'
import OrderHistory from './components/OrderHistory'
import Profile from './components/Profile'
import Logout from './components/Logout'



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container className='mt-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="catalog" index element={<Catalog />} />
          <Route path="past" element={<PastNumbers />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App
