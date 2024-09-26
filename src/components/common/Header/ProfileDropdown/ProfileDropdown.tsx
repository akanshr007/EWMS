import { Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutIcon, SettingsIcon } from "../../../../assets/icons/icons";
import avatar from "../../../../assets/images/avatar.jpg";
import { ROUTES } from "../../../../utils/constants";
import "./ProfileDropdown.scss";
import { useLogoutMutation } from "services/api";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "app/store";

const ProfileDropdown = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const user = useSelector((state: any) => state.user.userData);

  // API
  const [logout, { isLoading }] = useLogoutMutation();

  const clearAllData = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    // navigate(ROUTES.ROOT);
    navigate(ROUTES.ROOT, { replace: true });
  };

  const logoutHandler = async () => {
    try {
      const res = await logout({}).unwrap();
      if (res && res?.error === false) {
        clearAllData();
      } else {
        throw res;
      }
    } catch (error) {
      console.error("🚀 ~ logoutHandler ~ error:", error);
    }
  };
  return (
    <Dropdown className="profile_dropdown">
      <Dropdown.Toggle>
        <img src={avatar} alt="avatar" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={"div"} className="dropdown-user-info">
          <img src={avatar} alt="avatar" />
          <div>
            <h5>{user?.fullName}</h5>
            <h6 className="role">{user?.roleType}</h6>
            <p>{user?.email}</p>
          </div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <NavLink to={ROUTES.CHANGE_PASSWORD}>
          <SettingsIcon /> Change Password
        </NavLink>
        <button onClick={logoutHandler}>
          <LogoutIcon /> Logout
        </button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
