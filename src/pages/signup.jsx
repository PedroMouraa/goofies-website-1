import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Background from "../components/background/Background";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #4b0082;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  &:focus {
    outline: none;
    border-color: #6a1b9a;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #6a1b9a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #4a148c;
  }
`;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #333;
`;

const RegisterLink = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #6a1b9a;
  text-align: center;

  a {
    color: #6a1b9a;
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered:", userCredential.user);

      // Logar o usuário automaticamente após o registro
      await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("jwt", token);
      console.log("User logged in:", token);
      navigate("/connect");
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Background />
      <Form onSubmit={handleRegister}>
        <Title>Register</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Register</Button>
        <RegisterLink>
          Already have an account? <Link to="/">Log in now</Link>
        </RegisterLink>
      </Form>
    </>
  );
}

export default RegisterPage;
