import { Routes,Route } from 'react-router-dom';
import LoginForm from './pages/auth/loginPage';
import MainPage from './pages/main/MainPage';
function App() {

  return (
    <>
      <Routes>
         <Route path='/login'  element={<LoginForm/>}/>
         <Route path='/'  element={<MainPage/>}/>
      </Routes>
    </>
  )
}

export default App
