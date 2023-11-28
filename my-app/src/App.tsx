import './App.css'
import { Routes, Route, Navigate  } from 'react-router-dom';

import { AllModules } from './pages/AllModules'
import { ModuleInfo } from './pages/ModuleInfo'

import { AllMissions} from './pages/AllMissions'
import NavigationBar from './components/NavBar';
import { useEffect, useState } from 'react';
import LoadAnimation from './components/LoadAnimation';

function App() {
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  useEffect(()=>{
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function() {
        console.log(`${import.meta.env.BASE_URL}serviceWorker.js`)
        navigator.serviceWorker.register(`${import.meta.env.BASE_URL}serviceWorker.js`, { updateViaCache: 'none' })
        .then(() => {
          navigator.serviceWorker.ready.then(() => {
            console.log("service worker is ready");
            setServiceWorkerRegistered(true)
          })
        })
          .catch(err => console.log("service worker not registered", err))
      })
    }
  })
  
  return (
    <>
      <div className='container-xl px-2 px-sm-3'>
      <NavigationBar />
      {serviceWorkerRegistered ? (
      <Routes>
        <Route path="/" element={<Navigate to="modules" />} />
        <Route path="/modules" element={<AllModules />} />
        <Route path="/modules/:module_id" element={<ModuleInfo />} />
        <Route path="/missions" element={<AllMissions />} />
      </Routes>
      
       ) : (
        <LoadAnimation />
      )}
      </div>
    </>
  )
}

export default App