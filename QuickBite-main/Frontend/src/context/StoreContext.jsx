import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  // ─── Dynamic Base URL ───────────────────────────────────────────────────────
  const URl =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:4000"
      : window.location.origin;

  // ─── State ───────────────────────────────────────────────────────────────────
  const [cartItem, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // ─── Cart Functions ───────────────────────────────────────────────────────────
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          URl + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          URl + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItem) {
      if (cartItem[itemId] > 0) {
        const itemInfo = food_list.find((food) => food._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[itemId];
        }
      }
    }
    return totalAmount;
  };

  // ─── Food List ────────────────────────────────────────────────────────────────
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(URl + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ─── Cart Data ────────────────────────────────────────────────────────────────
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        URl + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // ─── Wishlist Functions ───────────────────────────────────────────────────────
  const toggleWishlist = async (foodId) => {
    try {
      const response = await axios.post(
        URl + "/api/user/wishlist/toggle",
        { foodId },
        { headers: { token } }
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const isWishlisted = (foodId) => {
    return wishlist.includes(foodId);
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(URl + "/api/user/wishlist", {
        headers: { token },
      });
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // ─── Dark Mode ────────────────────────────────────────────────────────────────
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : ""
    );
  };

  // ─── Coupon ───────────────────────────────────────────────────────────────────
  const applyCoupon = async (code, amount) => {
    try {
      const response = await axios.post(URl + "/api/coupon/apply", {
        code,
        cartAmount: amount,
      });
      if (response.data.success) {
        setDiscountAmount(response.data.discountAmount || 0);
        setCouponCode(code);
      }
      return {
        success: response.data.success,
        discountAmount: response.data.discountAmount || 0,
        message: response.data.message || "",
      };
    } catch (error) {
      console.error("Error applying coupon:", error);
      return {
        success: false,
        discountAmount: 0,
        message: "Failed to apply coupon. Please try again.",
      };
    }
  };

  // ─── Initialization ───────────────────────────────────────────────────────────
  useEffect(() => {
    const initialize = async () => {
      // Load food list
      await fetchFoodList();

      // Load token
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
        // Fetch wishlist if token exists (use savedToken directly, not state)
        try {
          const response = await axios.get(URl + "/api/user/wishlist", {
            headers: { token: savedToken },
          });
          if (response.data.success) {
            setWishlist(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching wishlist on init:", error);
        }
      }

      // Load dark mode preference
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setDarkMode(false);
        document.documentElement.setAttribute("data-theme", "");
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Context Value ────────────────────────────────────────────────────────────
  const contextValue = {
    food_list,
    cartItem,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    URl,
    token,
    setToken,
    wishlist,
    toggleWishlist,
    isWishlisted,
    fetchWishlist,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    couponCode,
    setCouponCode,
    discountAmount,
    setDiscountAmount,
    applyCoupon,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
