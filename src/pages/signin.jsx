import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../firebaseConfig";
import ConnectWallet from "../components/ConnectWallet";

export const Container = styled.div`
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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuário logado:", userCredential.user);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("jwt", token);
      console.log("Token JWT:", token);
      navigate("/connect");
    } catch (error) {
      setError(error.message);
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Title>Login</Title>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
      </Form>
    </Container>
  );
}

export default LoginPage;
