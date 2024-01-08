import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { AllModules, ModuleInfo, ModuleEdit, ModulesTable, AllMissions, MissionInfo, Authorization, Registration } from './pages'
import NavigationBar from './components/NavBar';

import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";

import AuthCheck, { CUSTOMER, MODERATOR } from './components/AuthCheck'

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/modules" />} />
          <Route path="/modules" element={<AllModules />} />
          <Route path="/modules/:module_id" element={<ModuleInfo />} />
          <Route path="/modules-edit" element={<AuthCheck allowedRoles={[MODERATOR]}><ModulesTable /></AuthCheck>} />
          <Route path="/modules-edit/:container_id" element={<AuthCheck allowedRoles={[MODERATOR]}><ModuleEdit /></AuthCheck>} />

          <Route path="/missions" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><AllMissions /></AuthCheck>} />
          <Route path="/missions/:mission_id" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><MissionInfo /></AuthCheck>} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App