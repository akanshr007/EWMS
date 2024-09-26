import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_in">
        <p>&#169;{new Date().getFullYear()} Antier - All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
