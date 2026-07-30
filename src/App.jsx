import { HashRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Levels from './pages/Levels'
import TestList from './pages/TestList'
import Exam from './pages/Exam'
import Result from './pages/Result'
import Admin from './pages/Admin'

// Dùng HashRouter (địa chỉ có dấu #) vì GitHub Pages là host tĩnh —
// HashRouter giúp F5/refresh ở bất kỳ trang nào cũng không bị lỗi 404.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/tests/:level" element={<TestList />} />
        <Route path="/exam/:file" element={<Exam />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  )
}
