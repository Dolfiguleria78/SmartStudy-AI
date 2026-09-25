import React from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <main className="container py-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;