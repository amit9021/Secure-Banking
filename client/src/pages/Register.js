import React, { useState } from "react";
import { Container, Dialog } from "@mui/material";
import { register, validateOtp } from "../services/api";
import Header from "../components/Header";
import BaseForm from "../components/BaseForm";
import containerStyles from "../styles/Container.module.css";

function RegisterPage({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      value: formData.name,
      onChange: (event) => updateField("name", event.target.value),
      required: true
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: formData.email,
      onChange: (event) => updateField("email", event.target.value),
      required: true
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      value: formData.phone,
      onChange: (event) => updateField("phone", event.target.value),
      required: true
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: formData.password,
      onChange: (event) => updateField("password", event.target.value),
      required: true
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      value: formData.confirmPassword,
      onChange: (event) => updateField("confirmPassword", event.target.value),
      required: true,
      error: formData.password !== formData.confirmPassword,
      helperText:
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : ""
    }
  ];

  function updateField(field, value) {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const response = await register(formData);
    if (response && response.validUser) {
      setErrorMsg("");
      setShowOtpDialog(true);
    } else {
      setErrorMsg(response?.error || "Registration failed. Please try again.");
    }
  }

  const otpFields = [
    {
      name: "otp",
      label: "Enter OTP",
      type: "text",
      value: otp,
      onChange: (event) => setOtp(event.target.value),
      required: true
    }
  ];

  async function handleOtpSubmit(event) {
    event.preventDefault();
    try {
      const response = await validateOtp({ formData, otp });

      if (response.OtpSuccess) {
        setPage("login");
      } else {
        setErrorMsg("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.error ||
          "Failed to validate OTP. Please try again."
      );
    }
  }

  return (
    <Container className={containerStyles.mainContainer}>
      <Header />
      <BaseForm
        title="Register"
        fields={fields}
        onSubmit={handleSubmit}
        errorMsg={errorMsg}
        submitButtonText="Sign Up"
        setPage={setPage}
      />

      <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)}>
        <BaseForm
          title="Verify OTP"
          fields={otpFields}
          onSubmit={handleOtpSubmit}
          errorMsg={errorMsg}
          submitButtonText="Verify"
          setPage={setPage}
        />
      </Dialog>
    </Container>
  );
}

export default RegisterPage;
