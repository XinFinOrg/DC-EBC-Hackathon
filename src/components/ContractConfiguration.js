import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAddress } from 'ethers/lib/utils';

import UserWalletContext from './UserWalletContext';
import ContractConfirmationPopup from './ContractConfirmationPopup';
import SmartSafeDeployer from './SmartSafeDeployer';



const WEB_SAFE_LINK = "/safe/";

function ContractConfiguration({ }) {
	const { wallet, setWallet } = useContext(UserWalletContext);
	const { userProvider, signer, userWallet, userAddress } = wallet;
	const { setUserProvider, setSigner, setUserWallet, setUserAddress } = setWallet;

	const [existingContractAddress, setExistingContractAddress] = useState('');

	const [ownerAddresses, setOwnerAddresses] = useState(['', '']);
	const [hours, setHours] = useState(0);

	const [isLoading, setIsLoading] = useState(false);
	const [isResultSuccessful, setIsResultSuccessful] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	// Contract address erro validation
	const [hasErrorContractAddress, setHasErrorContractAddress] = useState(false);

	// Confirmation Popup
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

	useEffect(() => {
		if (isResultSuccessful) {
			// todo - modal popup of successful contract deployment
		}
	}, [isResultSuccessful]);


	// Function to check for existing connection
	if (typeof userAddress === 'undefined' || userAddress === null) {
		console.log("redirecting to login", userAddress)
		return <Navigate replace to="/" />
	}

	const handleExistingContractAddressInputChange = (e) => {
		const inputValue = e.target.value;
		const err = inputValue && !isAddress(inputValue);
		setHasErrorContractAddress(err);
		if (err) {
			console.log("errr", err)
			return
		}

		setExistingContractAddress(inputValue);
	};

	const handleGoClick = () => {
		if (existingContractAddress) {
			// Redirecting the user
			return <Navigate replace to={`${WEB_SAFE_LINK}${existingContractAddress}`} />
		}
	};

	// Function to handle the value change of address inputs
	const handleInputChange = (index, event) => {
		const newOwnerAddresses = [...ownerAddresses];
		newOwnerAddresses[index] = event.target.value;
		setOwnerAddresses(newOwnerAddresses);
	};

	// Function to add a new address input
	const handleAddInput = () => {
		setOwnerAddresses(prevOwnerAddresses => [...prevOwnerAddresses, '']);
	};

	// Function to remove the last address input
	const handleRemoveInput = () => {
		if (ownerAddresses.length > 2) {
			const newOwnerAddresses = ownerAddresses.slice(0, ownerAddresses.length - 1);
			setOwnerAddresses(newOwnerAddresses);
		}
	};

	const handleSmartSafeDeploy = async () => {
		try {
			// contract deployment

			console.log("started deploying contract...");
			const expiryTimeInSeconds = hours * 60 * 60;
			const results = SmartSafeDeployer({ ownerAddresses, expiryTimeInSeconds })
			console.log("ended deploying contract...");

			setIsResultSuccessful("Successfully deployed the contract!");
		} catch (error) {
			setErrorMessage("Error. " + error.message);
		}
		setIsLoading(false);
	};

	const userDataValidator = () => {
		setErrorMessage(null);
		try {
			// check if the user sent the necessary
			if (ownerAddresses.some((address) => address === '')) {
				throw new Error("All the owner addresses should be full!");
			} else if (ownerAddresses.some((address) => !isAddress(address))) {
				throw new Error("All the owner addresses should be valid!");
			} else if (hours === 0) {
				throw new Error("Hours should be greater than 0!");
			}

			return true
		} catch (error) {
			setErrorMessage("Error. " + error.message);
		}
	}

	const handleConfirmationPopupConfirm = () => {
		// check if the user sent the necessary

		setIsConfirmationModalOpen(false);
		setIsResultSuccessful(false);
		setIsLoading(true);

		handleSmartSafeDeploy()
	}

	const handleConfirmationPopupCancel = () => {
		setIsConfirmationModalOpen(false);
	}

	const handleConfirmationPopupSpawn = () => {
		if (!userDataValidator()) {
			console.log("user data no valid")
			return
		}
		setIsConfirmationModalOpen(true);
		console.log("modal", isConfirmationModalOpen)
	}

	return (
		<div>
			<div className=""></div>

			{/* Two Columns Layout */}
			<div className="container py-16 mx-auto h-full relative z-10 flex items-center">
				{/* Left Column */}
				<div className="w-1/2 text-black text-center">
					<h1 className="text-4xl font-semibold mb-4">Welcome to your Profile</h1>
					<p className="text-lg">This is your prefesional dashboard</p>

				</div>

				{/* Right Column with an Image */}
				<div className="w-1/2">
					<div className='text-center'>

						<div className="flex justify-center items-center">
							<img src="/images/logoV2.png" alt="tree logo" className="max-w-sm text-center" />
						</div>


					</div>
				</div>
			</div>


			<div className="flex items-center  justify-center">
				<div className="w-3/5 md:w-2/5 flex flex-col bg-[#caebe1]  rounded-lg p-4 m-4 bg-[#caebe1] shadow-md items-center">
					<h2 className="text-2xl font-bold mb-4">Deploy New Contract</h2>
					<div className="flex space-x-2">
						<div className="flex flex-col">
							{ownerAddresses.map((address, index) => (
								<div key={index} className="mb-2">
									<input
										type="text"
										placeholder="Enter address"
										value={address}
										onChange={(e) => handleInputChange(index, e)}
										// onInput={(e) => handleInputChange(index, e)}
										className="w-48 px-3 py-2 border rounded focus:outline-none focus:border-indigo-500"
									/>
								</div>
							))}
							<div className="flex">
								<button onClick={handleAddInput} className="bg-blue-500 text-white px-3 py-1 rounded">
									+
								</button>

								<button onClick={handleRemoveInput} className="bg-red-500 text-white px-3 py-1 rounded">
									-
								</button>
							</div>
						</div>

						<div>
							<label className="block">
								Hours:
								<input
									type="number"
									value={hours}
									onChange={(e) => setHours(e.target.value)}
									className="w-24 px-3 py-2 border rounded focus:outline-none focus:border-indigo-500"
								/>
							</label>
						</div>
					</div>

					<button onClick={handleConfirmationPopupSpawn} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={isLoading}>
						Deploy
					</button>

					{/* Loading Indicator */}
					{isLoading && <div className="mt-4">Loading...</div>}

					{/* Error Message */}
					{errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
				</div>
			</div>


			<div className="flex items-center justify-center">
				<div className="w-3/5 md:w-2/5 flex flex-col bg-[#caebe1] rounded-lg p-4 m-4 bg-[#caebe1] shadow-md items-center">
					<div className="text-center">
						<h2 className="text-xl font-bold mb-4">Already Have A Contract?</h2>

						<p>
							Contract Address:
							<input onChange={handleExistingContractAddressInputChange} className={`border ${hasErrorContractAddress ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-indigo-500`}></input>
						</p>
						<button onClick={handleGoClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Go</button>

					</div>
				</div>


				<ContractConfirmationPopup
					ownerAddresses={ownerAddresses}
					hours={hours}

					open={isConfirmationModalOpen}
					onOk={handleConfirmationPopupConfirm}
					onCancel={handleConfirmationPopupCancel}
				/>

			</div>
		</div>


	);
}

export default ContractConfiguration;

