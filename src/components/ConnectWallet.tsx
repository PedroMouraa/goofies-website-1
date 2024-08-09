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
import React, { FC, ReactNode, useMemo, useEffect } from "react";

import { actions, utils, programs, NodeWallet, Connection } from "@metaplex/js";
import { getAuth } from "firebase/auth";

require("@solana/wallet-adapter-react-ui/styles.css");
let thelamports = 0;
let theWallet = "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9";

function getWallet() {}

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
  const { publicKey, connect, connected } = useWallet();
  const token = localStorage.getItem("jwt");

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

  //   let [lamports, setLamports] = useState(0.1);
  //   let [wallet, setWallet] = useState(
  //     "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9"
  //   );

  //   // const { connection } = useConnection();
  //   const connection = new Connection(clusterApiUrl("devnet"));
  //   const { publicKey, sendTransaction } = useWallet();

  //   const onClick = useCallback(async () => {
  //     if (!publicKey) throw new WalletNotConnectedError();
  //     connection.getBalance(publicKey).then((bal) => {
  //       console.log(bal / LAMPORTS_PER_SOL);
  //     });

  //     let lamportsI = LAMPORTS_PER_SOL * lamports;
  //     console.log(publicKey.toBase58());
  //     console.log("lamports sending: {}", thelamports);
  //     const transaction = new Transaction().add(
  //       SystemProgram.transfer({
  //         fromPubkey: publicKey,
  //         toPubkey: new PublicKey(theWallet),
  //         lamports: lamportsI,
  //       })
  //     );

  //     const signature = await sendTransaction(transaction, connection);

  //     await connection.confirmTransaction(signature, "processed");
  //   }, [publicKey, sendTransaction, connection]);

  //   function setTheLamports(e: any) {
  //     console.log(Number(e.target.value));
  //     setLamports(Number(e.target.value));
  //     lamports = e.target.value;
  //     thelamports = lamports;
  //   }
  //   function setTheWallet(e: any) {
  //     setWallet(e.target.value);
  //     theWallet = e.target.value;
  //   }
  return (
    <div>
      <WalletMultiButton />
    </div>
  );
};
