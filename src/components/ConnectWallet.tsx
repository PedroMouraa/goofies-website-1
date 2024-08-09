import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Button } from "@solana/wallet-adapter-react-ui/lib/types/Button";

import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import fs from "fs";

import {
  clusterApiUrl,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import React, {
  FC,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";

import { actions, utils, programs, NodeWallet, Connection } from "@metaplex/js";
import { getAuth } from "firebase/auth";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #6a0dad; /* Borda roxa */
  border-radius: 5px;
  outline: none;
  margin-right: 10px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #8a2be2; /* Borda mais clara ao focar */
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
    border-color: #cccccc;
  }
`;

const StyledButton = styled.button`
  background-color: #6a0dad; /* Fundo roxo */
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8a2be2; /* Fundo mais claro ao passar o mouse */
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StyledTitle = styled.h2`
  color: white; /* Cor branca para o texto */
  margin-top: -70px;
  margin-bottom: 50px;
  font-size: 28px; /* Tamanho da fonte maior para destaque */
  font-weight: bold;
  text-align: center;
  background: linear-gradient(90deg, #6a0dad, #8a2be2); /* Gradiente roxo */
  padding: 5px;
  border-radius: 8px; /* Bordas arredondadas */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para destacar */
  width: fit-content; /* Ajuste de largura */
  margin-left: auto;
  margin-right: auto;
`;



require("@solana/wallet-adapter-react-ui/styles.css");
let thelamports = 0;
// let theWallet = "3fC3M6ZMctfdweWPyFGy3YcZDznzpkGcGJ48JY48HEjJ";

function getWallet() { }

const ConnectWallet: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};

export default ConnectWallet;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  const { publicKey, connect, connected } = useWallet();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const { publicKey, connect, connected, sendTransaction } = useWallet();
  const token = localStorage.getItem("jwt");
  const [inputDisabled, setInputDisabled] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const linkWallet = async () => {
      if (user && publicKey) {
        const url =
          "https://us-central1-goofies-nft-17d95.cloudfunctions.net/getUserDetailsWithToken";

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();

          // Checar se o campo "wallet" está como "default"
          if (data.wallet !== publicKey.toBase58()) {
            const url =
              "https://us-central1-goofies-nft-17d95.cloudfunctions.net/linkWalletToUser";

            const requestBody = {
              email: user.email,
              wallet: publicKey.toBase58(), // Corrigido o fechamento do método e o objeto
            };

            try {
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const result = await response.json();
              console.log("Success:", result); // Opcional: log do resultado
            } catch (error) {
              console.error("Error linking wallet to user:", error);
            }
          } else {
            console.log("Essa carteira já está vinculada.");
          }

          // Retornar os dados recebidos
          return data;
        } catch (error) {
          console.error("Erro ao fazer a requisição:", error);
          return null;
        }
      }
    };

    linkWallet();
  }, [user, publicKey]); // Inclua as dependências corretas

  let [value, setValue] = useState(0.1);
  let [walletToSend, setWalletToSend] = useState(
    "3fC3M6ZMctfdweWPyFGy3YcZDznzpkGcGJ48JY48HEjJ"
  );

  const connection = new Connection(clusterApiUrl("devnet"));

  const TransferGoofies = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    connection.getBalance(publicKey).then((bal) => {
      console.log(bal / LAMPORTS_PER_SOL);
    });

    let lamportValue = LAMPORTS_PER_SOL * Number(value);
    console.log(publicKey.toBase58());
    console.log("value sending: {}", thelamports);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(walletToSend),
        lamports: lamportValue,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    const confirm = await connection.confirmTransaction(signature, "processed");

    if (confirm) {
      const url =
        "https://us-central1-goofies-nft-17d95.cloudfunctions.net/linkWalletToUser";

      const requestBody = {
        wallet: publicKey,
        solAmount: value, // Corrigido o fechamento do método e o objeto
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Success:", result); // Opcional: log do resultado
      } catch (error) {
        console.error("Error linking wallet to user:", error);
      }
    }

    console.log(confirm);
  }, [publicKey, sendTransaction, connection]);

  function setTheLamports(e: any) {
    console.log(Number(e.target.value));
    setValue(e.target.value);
    value = e.target.value;
    thelamports = value;
  }

  function handleInputChange(e: any) {
    if (!inputDisabled) {
      setValue(e.target.value);
      setInputDisabled(true); // Desabilita o input após a primeira alteração
    }
  }

  function setTheWallet(e: any) {
    setWalletToSend(e.target.value);
    setWalletToSend = e.target.value;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      width: '300px', 
      height: '300px',
      textAlign:'center'
    }}>
      {!connected && (
        <StyledTitle>Connect Wallet</StyledTitle>
      )}
      <WalletMultiButton />
      {connected && (
        <>
          <StyledInput
            value={value}
            onChange={handleInputChange}
            disabled={inputDisabled} // Controla a desativação do input
          />
          <StyledButton onClick={TransferGoofies}>Send Solana</StyledButton>
        </>
      )}
    </div>

  );
};
