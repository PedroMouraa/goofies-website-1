// Connect.js
import Background from "../components/background/Background";
import ConnectWallet from "../components/ConnectWallet";
import { Container } from "./signin";

export default function Connect() {
  const token = localStorage.getItem("jwt");

  return (
    <>
      <Background />
      <ConnectWallet />
    </>
  );
}
