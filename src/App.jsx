import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import EditorPage from './components/EditorPage'


const App = () => {
  return (
    <div>
      <div>
        <Toaster position='top-center'></Toaster>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/editor/:roomId' element={<EditorPage />} />
      </Routes>
    </div>
  )
}

export default App