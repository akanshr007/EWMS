import { Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logos/antier-logo.webp";
import mobile_logo from "../../../assets/logos/logo.png";
import { ROUTES } from "../../../utils/constants";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown";
import "./Header.scss";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../redux/slices/user.slice";

const Header = () => {
  // States
  const [active, setActive] = useState(false);
  const [scroll, setScrolled] = useState(false);
  const permittedRoutes = useSelector((state: any) => state.user.permissions);

  // Hooks
  const dispatch = useDispatch();

  // API
  const { data: profileData, isLoading: profileFetched } = useGetProfileQuery(
    {}
  );

  const handleActive = () => setActive(!active);

  useEffect(() => {
    if (profileData) {
      dispatch(setUserData(profileData));
    }
  }, [profileData, dispatch]);

  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     setScrolled(window.scrollY > 10);
  //   });
  // }, []);

  return (
    // <header className={`header ${scroll ? "scrollheader" : ""}`}>
    <header className="header">
      <Container>
        <div className="header_in">
          <Link to={ROUTES.ROOT} className="header_logo">
            <img src={logo} alt="logo" />
            <img src={mobile_logo} alt="logo" className="mobile_logo" />
          </Link>
          {active && (
            <div
              onClick={handleActive}
              className={`backdrop ${active ? "active" : ""}`}
            ></div>
          )}
          <div className="d-flex align-items-center">
            <div className={`header_action ${active ? "active" : ""}`}>
              <Link to={ROUTES.ROOT} className="header_logo">
                <img
                  src={mobile_logo}
                  alt="logo"
                  className="mobile_logo d-md-none"
                />
              </Link>
              {permittedRoutes?.length > 0 && (
                <ul>
                  {permittedRoutes?.includes(ROUTES.PROJECTS) && (
                    <li>
                      <NavLink to={ROUTES.PROJECTS} onClick={handleActive}>
                        Projects
                      </NavLink>
                    </li>
                  )}
                  {permittedRoutes?.includes(ROUTES.EMPLOYEES) && (
                    <li>
                      <NavLink to={ROUTES.EMPLOYEES} onClick={handleActive}>
                        Team Members
                      </NavLink>
                    </li>
                  )}

                  {permittedRoutes?.includes(ROUTES.REPORTS) && (
                    <li>
                      <NavLink to={ROUTES.REPORTS} onClick={handleActive}>
                        Hours Log
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="header_action_right d-flex align-items-center">
              <ProfileDropdown />
              <button
                onClick={handleActive}
                className={`toggler d-md-none ${active ? "active" : ""}`}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
