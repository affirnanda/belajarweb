import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
// import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute  */}
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />

     
       
          <Route index element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/add_employee" element={<AddEmployee />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/add_category" element={<AddCategory />} />
          
          <Route path="edit_employee/:id" element={<EditEmployee />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
