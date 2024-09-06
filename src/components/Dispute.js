/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import eCourtContract from "../../artifacts/contracts/eCourt.sol/eCourt.json";
import { jsx, Box } from 'theme-ui';
import { useRouter } from 'next/router'
import { useNavigate, useLocation } from "react-router-dom";
import Web3Modal from "web3modal";
import Image from 'next/image';
import { rgba } from 'polished';
//import "./index.css";

function Dispute() {
  const [provider, setProvider] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [defendant, setDefendant] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [filingFee, setFilingFee] = useState(0);
  const [selectedCase, setSelectedCase] = useState(undefined);
  const [verdict, setVerdict] = useState("");
  const [settlementFee, setSettlementFee] = useState(0);
  const [evidence, setEvidence] = useState("");

  useEffect(() => {

    const init = async () => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa37dc' }], // chainId must be in hexadecimal numbers
      });
      
      try {
        
        if (window.ethereum) {
          const web3Modal = new Web3Modal({
            //network: 'mainnet',
            cacheProvider: true,
          })
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          console.log("provider is", provider)
          const signer = provider.getSigner();
          //const contract = new ethers.Contract(fileShareAddress, fileNFT.abi, signer);
          //const data = await contract.fetchAllStorageItems();
          console.log("Signer is", signer)
          const accounts = await provider.listAccounts();
          console.log("accounts is", accounts)
          console.log("eCourtContract.address is", eCourtContract.address)
          console.log("eCourtContract.abi is", eCourtContract.abi)
          const contract = new ethers.Contract(
            eCourtContract.address,
            eCourtContract.abi,
            signer
          );
  
          setProvider(provider);
          setAccounts(accounts);
          setContract(contract);
          setLoading(false);
        } else {
          throw new Error("Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error while loading the application: ", error);
        setError("Error while loading the application.");
      }
    };
    // switchNetwork(); 
    init();
  }, []);

/**
  const switchNetwork = async () => {
    if (!provider) return;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(8217) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: toHex(8217),
                chainName: "Klaytn TestNet",
                rpcUrls: ["https://klaytn-mainnet-rpc.allthatnode.com:8551"],
                blockExplorerUrls: ["https://baobob.scope.com/"],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
    }
  };
 */
  
  const handleOpenCase = async () => {
    try {
      const filingFeeWei = ethers.utils.parseEther(filingFee.toString());
      const overrides = {
        value: filingFeeWei,
        gasLimit: 5000000000, // Manually set the gas limit
      };
      console.log("defendant is ", defendant)
      console.log("caseDetails is ", caseDetails)
      console.log("filingFeeWei is ", filingFeeWei)
      console.log("overrides is ", overrides)
      const tx = await contract.openCase(
        defendant,
        caseDetails,
        filingFeeWei,
        overrides
      );
      console.log("transaction is = ", tx)
      await tx.wait();
      alert("Case opened successfully!");
      setDefendant("");
      setCaseDetails("");
      setFilingFee(0);
    } catch (error) {
      console.error("Error while opening the case: ", error);
      alert("Error while opening the case.");
    }
  };

  const handleSettleCase = async () => {
    try {
      const settlementFeeWei = ethers.utils.parseEther(
        settlementFee.toString()
      );
      const overrides = {
        value: settlementFeeWei,
        gasLimit: 10000000000000000, // Manually set the gas limit
      };
      const tx = await contract.settleCase(
        selectedCase,
        verdict,
        settlementFeeWei,
        overrides
      );
      await tx.wait();
      alert("Case settled successfully!");
      setVerdict("");
      setSettlementFee(0);
      setSelectedCase(undefined);
    } catch (error) {
      console.error("Error while settling the case: ", error);
      alert("Error while settling the case.");
    }
  };

  const handleSubmitEvidence = async () => {
    try {
      const evidenceBytes = ethers.utils.toUtf8Bytes(evidence);
      const overrides = {
        gasLimit: 3000000, // Manually set the gas limit
      };
      const tx = await contract.submitEvidence(
        selectedCase,
        evidenceBytes,
        overrides
      );
      await tx.wait();
      alert("Evidence submitted successfully!");
      setEvidence("");
      setSelectedCase(undefined);
    } catch (error) {
      console.error("Error while submitting evidence: ", error);
      alert("Error while submitting evidence.");
    }
  };

  const loadCases = async () => {
    try {
      const userCases = await contract.getUserCases(accounts[0]);
      const casesData = await Promise.all(
        userCases.map(async (caseId) => {
          const caseData = await contract.getCaseDetails(caseId);
          return { ...caseData, caseId };
        })
      );
      setCases(casesData);
    } catch (error) {
      console.error("Error while loading cases: ", error);
      setError("Error while loading cases.");
    }
  };
/**
  useEffect(() => {
    if (contract && accounts.length > 0) {
      loadCases();
    }
  }, [contract, accounts]);
 */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 ">

      <div className="mx-10">
        <h1 className="text-3xl font-bold mb-14 mt-36">Legal Dispute DApp (Create Dispute)</h1>

        <div className="grid gap-4 mb-8 mt-10">
          <div>
            <h2 className="text-xl font-bold mb-2">Open a Dispute</h2>
            <div className="flex flex-col mb-4">
              <label htmlFor="defendant" className="mb-1">
                Defendant Address:
              </label>
              <input
                type="text"
                id="defendant"
                className="p-2 border w-full rounded text-black"
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="caseDetails" className="mb-1">
                Case Details:
              </label>
              <textarea
                id="caseDetails"
                className="p-2 border rounded h-24 text-black"
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="filingFee" className="mb-1">
                Filing Fee (ETH):
              </label>
              <input
                type="number"
                id="filingFee"
                className="p-2 border rounded text-black"
                value={filingFee}
                onChange={(e) => setFilingFee(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleOpenCase}
            >
              Open Case
            </button>
          </div>

          
          <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">Your Cases</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Details</th>
                <th className="border px-4 py-2">Plaintiff</th>
                <th className="border px-4 py-2">Defendant</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.caseId}>
                  <td className="border px-4 py-2">{c.caseId}</td>
                  <td className="border px-4 py-2">{c.caseDetails}</td>
                  <td className="border px-4 py-2">{c.plaintiff}</td>
                  <td className="border px-4 py-2">{c.defendant}</td>
                  <td className="border px-4 py-2">
                    {c.isSettled ? "Settled" : "Active"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dispute;