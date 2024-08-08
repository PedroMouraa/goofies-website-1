// Connect.js
import ConnectWallet from "../components/ConnectWallet";
import { Container } from "./signin";

export default function Connect() {
  const token = localStorage.getItem("jwt");

  return (
    <Container>
      <ConnectWallet />
    </Container>
  );
}
