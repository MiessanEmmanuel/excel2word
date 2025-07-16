
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Projects from './pages/projets/Index.jsx';
import NotFound from './pages/NotFound.jsx';
import CreateProject from './pages/projets/Create.jsx';
import EditProject from './pages/projets/Edit.jsx';
import ShowProject from './pages/projets/ Show.jsx';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx';
import FreeRoute from './pages/auth/FreeRoute.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';

function App() {
  return (

    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/projets" element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>

      } />
      <Route path="/admin" element={
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/projets/create" element={
        <ProtectedRoute>
          <CreateProject />
        </ProtectedRoute>
      } />
      <Route path="/projets/edit/:id" element={
        <ProtectedRoute roles={["admin"]}>
          <EditProject />
        </ProtectedRoute>
      } />
      <Route path="/projets/:id" element={
        <ProtectedRoute >
          <ShowProject />
        </ProtectedRoute>

      } />
      <Route path="/register" element={
        <ProtectedRoute >
          <Register />
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={
        <FreeRoute>
          <Login />
        </FreeRoute>

      } />
      <Route path="*" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />
    </Routes>


  );
}

export default App;