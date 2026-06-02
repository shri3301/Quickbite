import { useContext } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)

  const navigate = useNavigate()
  const Logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <div className={style.Navbar}>
      <Link to="/"><img src={assets.logo} className={style.logo} /></Link>
      <ul className={style.navbarMenu}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? style.active : "")}
        >
          home
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) => (isActive ? style.active : "")}
        >
          menu
        </NavLink>
        <NavLink
          to="/mobile-app"
          className={({ isActive }) => (isActive ? style.active : "")}
        >
          mobile-app
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? style.active : "")}
        >
          contact us
        </NavLink>
      </ul>
      <div className={style.navbarRight}>
        <div className={style.searchIcon} onClick={() => navigate('/menu')}>
          <img src={assets.search_icon} alt="Search menu" />
        </div>
        <div className={style.cartIcon}>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() ? style.dot : ""}></div>
        </div>
        {!token ? <button type="button"
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Sign in
        </button> : <div className={style.navbarProfile}>
          <img src={assets.profile_icon} alt="Profile" />
          <ul className={style.navProfileDropdown}>
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} /><p>Orders</p></li>
            <hr />
            <li onClick={Logout}><img src={assets.logout_icon} /><p>Logout</p></li>
          </ul>
        </div>}

      </div>
    </div>
  );
};

export default Navbar;
