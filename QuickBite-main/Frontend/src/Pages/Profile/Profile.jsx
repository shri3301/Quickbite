import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./profile.css";

const Profile = () => {
  const { token, URl } = useContext(StoreContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(URl + "/api/user/profile", {
          headers: { token },
        });
        if (res.data.success) {
          setProfile(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        URl + "/api/user/profile/update",
        profile,
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Profile updated!");
      } else {
        toast.error(res.data.message || "Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        {loading ? (
          <div className="profile-loading">Loading your profile...</div>
        ) : (
          <div className="profile-card">
            <div className="avatar">{avatarLetter}</div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="profile-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="profile-input disabled-input"
                disabled
              />
              <span className="field-hint">Email cannot be changed</span>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="profile-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="House no., Street, Area, City..."
                className="profile-input profile-textarea"
                rows={3}
              />
            </div>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
