import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 409) {
      console.log(err.response.data);
      return err.response.data;
    } else {
      console.log(err);
    }
  }
};

export const GetDashboardData = async () => {
  try {
    const token = localStorage.getItem("LoginAuth");
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const GetUserData = async () => {
  try {
    const token = localStorage.getItem("LoginAuth");
    const response = await axios.get(`${API_URL}/register`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data.name;
  } catch (error) {
    console.error(error);
  }
};

export const MakeTransfer = async (data) => {
  try {
    const token = localStorage.getItem("LoginAuth");
    const response = await axios.post(`${API_URL}/transfer`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

export const Login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 409) {
      console.log(err.response.data);
      return err.response.data.message;
    } else {
      console.log(err);
    }
  }
};

export const validateOtp = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/register/otp_validator`,
      data
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const CheckAuth = async () => {
  try {
    const token = localStorage.getItem("LoginAuth");
    if (token) {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Received auth response:", response);
      return response.status === 200;
    }
  } catch (error) {
    return false;
  }
};
