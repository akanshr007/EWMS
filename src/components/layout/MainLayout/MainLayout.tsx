import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import Header from "../../common/Header/Header";
import Footer from "../../common/Footer/Footer";
import { ROUTES } from "utils/constants";

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("storage", () => {
      if (localStorage.getItem("token") === null) navigate(ROUTES?.ROOT);
    });
  }, []);

  return (
    <div className="main_layout">
      <Header />
      <div className="layout_in">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
