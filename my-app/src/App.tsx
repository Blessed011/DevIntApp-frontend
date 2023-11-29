import { Routes, Route, Navigate } from 'react-router-dom';
import { AllModules } from './pages/AllModules'
import { ModuleInfo } from './pages/ModuleInfo'
import { AllMissions } from './pages/AllMissions'
import NavigationBar from './components/NavBar';

function App() {

  return (
    <>
      <NavigationBar />
      <div className='container-xl px-2 px-sm-3'>
        <Routes>
          <Route path="/" element={<Navigate to="modules" />} />
          <Route path="/modules" element={<AllModules />} />
          <Route path="/modules/:module_id" element={<ModuleInfo />} />
          <Route path="/missions" element={<AllMissions />} />
        </Routes>
      </div>
    </>
  )
}

export default App