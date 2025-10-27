import React, { useState } from "react";
import { Login } from "../services/api";
import { Container } from "@mui/material";
import Header from "../components/Header";
import BaseForm from "../components/BaseForm";
import containerStyles from "../styles/Container.module.css";

function LoginPage({ setPage }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      value: formData.email,
      onChange: (event) => updateField("email", event.target.value),
      required: true
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: formData.password,
      onChange: (event) => updateField("password", event.target.value),
      required: true
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
    localStorage.clear();
    const response = await Login(formData);
    if (response.token) {
      localStorage.setItem("LoginAuth", response.token);
      setPage("dashboard");
    } else {
      setErrorMsg(response || "Login failed. Please try again.");
    }
  }

  return (
    <Container className={containerStyles.mainContainer}>
      <Header />
      <BaseForm
        title="Login"
        fields={fields}
        onSubmit={handleSubmit}
        errorMsg={errorMsg}
        submitButtonText="Sign In"
        setPage={setPage}
      />
    </Container>
  );
}

export default LoginPage;
