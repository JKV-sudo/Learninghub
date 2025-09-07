import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import AppLayout from "./ui/AppLayout";
import LoadingSpinner from "./ui/LoadingSpinner";
import Home from "./pages/Home";
import ImportPack from "./pages/ImportPack";
import Dashboard from "./pages/Dashboard";
import PackView from "./pages/PackView";

import { AuthProvider, useAuth } from "./state/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner message="Authentifizierung..." />
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/import"
              element={
                <PrivateRoute>
                  <ImportPack />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/packs/:id" element={<PackView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
