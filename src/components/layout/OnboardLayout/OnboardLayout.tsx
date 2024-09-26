import { ROUTES } from "utils/constants";
import "./OnboardLayout.scss";
import Logo from "../../../assets/logos/antier-logo.webp";
import Fav from "../../../assets/images/fav-logo.png";
import { Link, Outlet } from "react-router-dom";

const OnboardLayout = () => {
  return (
    <div className="onboard_layout">
      <div className="onboard_card">
        <img src={Logo} alt="" className="onboard_card_brand"/>
        <div className="onboard_header_logo">
          <Link to={ROUTES.ROOT}>
            <img src={Fav} className="onboard_logo" alt="logo" />
          </Link>
          <h3>EWMS</h3>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default OnboardLayout;
