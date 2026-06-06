import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./navbar.css";

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken, darkMode, toggleDarkMode, searchQuery, setSearchQuery, food_list } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const filtered = food_list.filter(f =>
        f.name.toLowerCase().includes(val.toLowerCase()) ||
        f.category.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    setSuggestions([]);
    setSearchOpen(false);
    navigate("/menu");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cartCount = Object.values(getTotalCartAmount ? {} : {}).length;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span>Foodify</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Menu</NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Wishlist</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
        </ul>

        {/* Right Controls */}
        <div className="navbar-right">
          {/* Search */}
          <div className="search-wrapper" ref={searchRef}>
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            {searchOpen && (
              <div className="search-dropdown">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search dishes, categories..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={(e) => { if (e.key === "Enter") { setSuggestions([]); setSearchOpen(false); navigate("/menu"); }}}
                />
                {suggestions.length > 0 && (
                  <ul className="search-suggestions">
                    {suggestions.map(item => (
                      <li key={item._id} onClick={() => handleSuggestionClick(item)}>
                        <span className={`veg-dot ${item.isVeg === false ? "nonveg" : ""}`}></span>
                        <span>{item.name}</span>
                        <span className="suggestion-cat">{item.category}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button className="icon-btn dark-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
          </Link>

          {/* Auth */}
          {!token ? (
            <button className="btn-signin" onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="profile-menu">
              <button className="icon-btn profile-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </Link>
                <Link to="/myorders" className="dropdown-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  My Orders
                </Link>
                <Link to="/wishlist" className="dropdown-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Wishlist
                </Link>
                <hr />
                <button className="dropdown-item logout-btn" onClick={logout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/menu" onClick={() => setMenuOpen(false)}>Menu</NavLink>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
          <NavLink to="/myorders" onClick={() => setMenuOpen(false)}>My Orders</NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          {!token ? (
            <button className="btn-signin" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Sign In</button>
          ) : (
            <button className="btn-signin" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
