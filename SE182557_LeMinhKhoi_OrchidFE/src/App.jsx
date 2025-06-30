import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route} from 'react-router'
import ListOfOrchids from './components/ListOfOrchids';
import EditOrchid from './components/EditOrchid';
import HomeScreen from './components/HomeScreen';
import NavBar from './components/NavBar';
import ListOfEmployees from './components/ListOfEmployees';
import DetailOrchid from './components/DetailOrchid';
import Login from './components/Login';
import Cart from './components/Cart';
import Orders from './components/orders';
import Register from './components/Register';
import Profile from './components/profile';
import EditUser from './components/EditUser';
import Order_Management from './components/Order_Management';
function App() {
 
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/home' element={<HomeScreen/>}/>
      <Route path='/home' element={<HomeScreen/>}/>
      <Route path='/orchids' element={<ListOfOrchids/>}/>
      <Route path='/detail/:id' element={<DetailOrchid/>}/>
      <Route path='/edit/:id' element={<EditOrchid/>}/>
      <Route path='/employee' element={<ListOfEmployees/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/orders' element={<Orders/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/editUser/:id' element={<EditUser/>}/>
      <Route path='/order_management' element={<Order_Management/>}/>
    </Routes>
    </>
  )
}

export default App