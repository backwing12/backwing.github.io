import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Minesweeper from './pages/Minesweeper'
import Catalogue from './pages/Catalogue'
import Admin from './pages/Admin'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/minesweeper" element={<Minesweeper />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App