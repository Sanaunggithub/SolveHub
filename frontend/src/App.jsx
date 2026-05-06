import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import Member from './pages/Member'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import BlogManagement from './pages/BlogManagement'
import Discussions from './pages/Discussion'
import Home from './pages/Home'
import DiscussionDetail from './components/DiscussionDetail'

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/discussions' element={<Discussions />}/>
          <Route path='/members' element={<Member />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/blogs' element={<Blog />}/>
          <Route path='/blog/:id' element={<BlogDetail />}/>
          <Route path='/my-blogs' element={<BlogManagement />}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path="/discussions/:id" element={<DiscussionDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App