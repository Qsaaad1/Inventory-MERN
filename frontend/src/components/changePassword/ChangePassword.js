import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";
import Card from "../card/Card";
import { useNavigate } from "react-router-dom";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const changePass = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      return toast.error("New passwords do not match");
    }

    const formData = {
      oldPassword,
      password,
    };

    const data = await changePassword(formData);
    toast.success(data);
    navigate("/profile");
  };

  return (
    <div className="change-password">
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className="--form-control former">
          <input
            type="password"
            placeholder="Old Password"
            required
            name="oldPassword"
            value={oldPassword}
            onChange={handleInputChange}
            className="inputter"
          />
          <input
            type="password"
            placeholder="New Password"
            required
            name="password"
            value={password}
            onChange={handleInputChange}
            className="inputter"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            required
            name="password2"
            value={password2}
            onChange={handleInputChange}
            className="inputter"
          />
        </form>
        <div className="dividerbtn">
        <form onSubmit={changePass} className="--form-control former">
          <button type="submit" className="--btn --btn-primary dividerbtn">
            Change Password
          </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChangePassword;
