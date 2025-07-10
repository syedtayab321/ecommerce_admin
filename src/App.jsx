import { Routes,Route } from 'react-router-dom';
import LoginForm from './pages/auth/loginPage';
import MainPage from './pages/main/MainPage';
import ProtectedRoute from './routes/protectedRoute';
function App() {

  return (
    <>
      <Routes>
         <Route path='/'  element={<LoginForm/>}/>
          <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
