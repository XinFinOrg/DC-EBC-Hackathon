import React from "react";
import LandingPage from "./LandingPage";
import { useState } from "react";
import { BrowserRouter, Route, Routes, Link, Outlet } from "react-router-dom";
import ContractConfiguration from "./components/ContractConfiguration";
import ContractPage from "./pages/ContractPage";

import UserWalletContext from "./components/UserWalletContext";

function App() {

  const [userProvider, setUserProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const wallet = {
    userProvider,
    signer,
    userAddress
  };

  const setWallet = {
    setUserProvider,
    setSigner,
    setUserAddress
  };

  return (
    <div className="">
      <UserWalletContext.Provider value={{ wallet, setWallet }}>
        <BrowserRouter>

          <div className="bg-green-400">
            <div className="bg-[#caebe1] py-4 300 flex justify-between border-b-4 border-[#57C6A3] items-center">
              <div className="flex items-center">
                <img src="\images\LogoV1.png" alt="Your Logo" className="h-16 pl-4 mt-0" />
              </div>
              <div className="grid grid-cols-2 gap-4 justify-center text-center">
                <nav>
                  <div className="text-black">
                    <a className="text-black no-underline" href="/">HOME</a>
                  </div>
                </nav>
                <nav>
                  <div className="text-white  pr-8">
                    <a className="text-black no-underline" href="/dashboard">DASHBOARD</a>
                  </div>
                </nav>
              </div>
            </div>

          </div>



          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<ContractConfiguration />} />
            <Route path="/safe/:contractAddress?" element={<ContractPage />} />
          </Routes>

        </BrowserRouter>
      </UserWalletContext.Provider>
    </div>
  );
}

export default App;
