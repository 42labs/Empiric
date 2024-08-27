import React, { useState } from "react";
import styles from "./styles.module.scss";
import BoxContainer from "../components/common/BoxContainer";
import classNames from "classnames";
import { Listbox, Transition } from "@headlessui/react";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { CallData, byteArray } from "starknet";
import WalletConnection from "../components/common/WalletConnection";
import { OO_CONTRACT_ADDRESS, CURRENCIES } from "./constants";
import {
  useAccount,
  useContractWrite,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "@starknet-react/core";
import OOAbi from "../abi/OO.json";
import { uint256, shortString } from "starknet";
import NetworkSelection from "../components/common/NetworkSelection";

const generateTimestamp = () => {
  const currentTimestamp = new Date();
  return `${currentTimestamp.getDate().toString().padStart(2, "0")}/${(
    currentTimestamp.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${currentTimestamp.getFullYear()}, ${currentTimestamp
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentTimestamp
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

function buildAssertion(
  title: string,
  description: string,
  timestamp: string
): string {
  return `An assertion was published at ${timestamp}. The title of the assertion is: ${title}, the description is: ${description}.`;
}

const Request = () => {
  const { address, isConnected } = useAccount();
  const [network, setNetwork] = useState<string>("sepolia");
  const NETWORKS = ["sepolia", "mainnet"];
  const IDENTIFIER = "ASSERT_TRUTH";
  const currency = CURRENCIES[network];
  const {} = useNetwork();
  const [isProcessing, setIsProcessing] = useState(false);
  const [assertion, setAssertion] = useState<string | undefined>(undefined);
  const [assertHash, setAssertHash] = useState<string | undefined>();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: "",
    bond: "",
    currency: currency[0],
    challengePeriod: "",
    expirationTime: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setFormData((prevState) => ({
      ...prevState,
      currency: selectedCurrency,
    }));
  };

  // Get minimum bond
  const { data: minimumBond, isLoading: isMinimumBondLoading } =
    useContractRead({
      address:
        network == "sepolia"
          ? OO_CONTRACT_ADDRESS.sepolia
          : OO_CONTRACT_ADDRESS.mainnet,
      abi: OOAbi,
      functionName: "get_minimum_bond",
      args: [formData.currency.address],
      watch: true,
    });

  const minimumBondString = minimumBond?.toString();
  const { writeAsync: approveAndAssert } = useContractWrite({
    calls:
      address && assertion && minimumBondString
        ? [
            {
              contractAddress: currency[0].address,
              entrypoint: "approve",
              calldata: [
                network == "sepolia"
                  ? OO_CONTRACT_ADDRESS.sepolia
                  : OO_CONTRACT_ADDRESS.mainnet,
                uint256.bnToUint256(minimumBondString).low,
                uint256.bnToUint256(minimumBondString).high,
              ],
            },
            {
              contractAddress:
                network == "sepolia"
                  ? OO_CONTRACT_ADDRESS.sepolia
                  : OO_CONTRACT_ADDRESS.mainnet,
              entrypoint: "assert_truth",
              calldata: CallData.compile([
                byteArray.byteArrayFromString(assertion),
                address,
                0,
                0,
                formData.challengePeriod,
                formData.currency.address,
                uint256.bnToUint256(formData.bond).low,
                uint256.bnToUint256(formData.bond).high,
                shortString.encodeShortString(IDENTIFIER),
                0,
                0,
              ]),
            },
          ]
        : undefined,
  });
  // Wait for assert transaction
  const {
    isLoading: isAssertLoading,
    isError: isAssertError,
    error: assertError,
  } = useWaitForTransaction({
    hash: assertHash,
    watch: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the address is connected
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ["title", "description", "bond", "challengePeriod"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please complete the ${field} field.`);
        return;
      }
    }

    // Ensure bond is greater than or equal to minimumBond
    if (minimumBond && Number(formData.bond) < Number(minimumBond)) {
      alert(
        `The bond must be greater than or equal to the minimum bond: ${minimumBond}`
      );
      return;
    }

    const currentTimestamp = generateTimestamp();

    const submissionData = {
      ...formData,
      timestamp: currentTimestamp,
    };

    console.log("Form submitted:", submissionData);

    setFormData((prevState) => ({
      ...prevState,
      timestamp: currentTimestamp,
    }));

    setAssertion(
      buildAssertion(formData.title, formData.description, formData.timestamp)
    );

    try {
      // Approve and Assert in a single transaction
      const result = await approveAndAssert();
      console.log("Transaction hash:", result.transaction_hash);
      setAssertHash(result.transaction_hash);

      const timeout = 120000; // 2 minutes timeout
      const startTime = Date.now();

      while (isAssertLoading && Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      }

      if (isAssertError) {
        throw new Error(`Transaction failed: ${assertError?.message}`);
      }

      alert(
        `Assertion submitted successfully, with tx hash: ${result.transaction_hash}`
      );
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to process the assertion. Reason: ${error}`);
    } finally {
      setIsProcessing(false);
      setAssertHash(undefined);
    }
  };

  const router = useRouter();

  return (
    <div
      className={classNames(
        "relative w-full overflow-x-hidden",
        styles.bigScreen
      )}
    >
      <BoxContainer>
        <div className="pb-20"></div>
      </BoxContainer>
      <BoxContainer modeOne={false}>
        <div className="flex w-full flex-col gap-4 md:flex-row md:pb-10">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => {
                // Go back to the previous page
                router.back();
              }}
              className="my-auto flex cursor-pointer items-center gap-2 rounded-full border border-lightGreen p-2 text-left text-sm uppercase tracking-widest text-lightGreen hover:bg-lightGreen hover:text-darkGreen"
            >
              <ArrowLeftIcon className="w-4" />
            </button>
            <h2 className=" text-lightGreen">Submit a request</h2>
          </div>
          <div className="relative flex flex-row gap-3 pb-4 md:ml-auto md:items-center md:justify-center md:pb-0">
            <NetworkSelection setNetwork={setNetwork} />
            <WalletConnection network={network} />
          </div>
        </div>
      </BoxContainer>
      <BoxContainer>
        <div className="flex w-full flex-col gap-10 lg:w-8/12 xl:w-7/12">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="title"
              className="block pb-3 text-xl tracking-wider text-lightGreen"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter request title"
              className="w-full rounded-full bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="description"
              className="block pb-3 text-xl tracking-wider text-lightGreen"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter request description"
              className="w-full rounded-md bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
              rows={4}
            />
          </div>

          {/* <div className="flex flex-col gap-3">
              <label
                htmlFor="timestamp"
                className="block pb-3 text-xl tracking-wider text-lightGreen"
              >
                Timestamp
              </label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleInputChange}
                className="w-full rounded-full bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
              />
            </div> */}

          <div className="flex flex-col gap-3">
            <label
              htmlFor="currency"
              className="block pb-3 text-xl tracking-wider text-lightGreen"
            >
              Currency
            </label>
            <Listbox value={formData.currency} onChange={handleCurrencyChange}>
              <div className="relative mt-1">
                <Listbox.Button className="relative flex w-full cursor-pointer  flex-row rounded-full bg-lightBlur py-3 px-6 text-center text-sm text-lightGreen focus:outline-none">
                  <span className="block truncate">
                    {formData.currency.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-darkGreen py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {currency.map((currency) => (
                      <Listbox.Option
                        key={currency.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-lightGreen text-darkGreen"
                              : "text-lightGreen"
                          }`
                        }
                        value={currency}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {currency.name}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="bond"
              className="block pb-3 text-xl tracking-wider text-lightGreen"
            >
              Bond (in Wei)
            </label>
            <input
              type="number"
              id="bond"
              name="bond"
              value={formData.bond}
              onChange={handleInputChange}
              placeholder={
                isMinimumBondLoading
                  ? "Loading minimum bond..."
                  : `Minimum bond: ${minimumBond}`
              }
              className="w-full rounded-full bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useMinimumBond"
              name="useMinimumBond"
              onChange={(e) => {
                if (e.target.checked && minimumBond) {
                  setFormData((prev) => ({
                    ...prev,
                    bond: minimumBond.toString(), // Ensure bond is a string
                  }));
                }
              }}
              className="rounded bg-lightBlur text-lightGreen focus:outline-none"
            />
            <label htmlFor="useMinimumBond" className="text-sm text-lightGreen">
              Use minimum bond
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="challengePeriod"
              className="block pb-3 text-xl tracking-wider text-lightGreen"
            >
              Challenge Period Duration
            </label>
            <input
              type="text"
              id="challengePeriod"
              name="challengePeriod"
              value={formData.challengePeriod}
              onChange={handleInputChange}
              placeholder="Enter challenge period (in seconds)"
              className="w-full rounded-full bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
            />
          </div>

          {/* <div className="flex flex-col gap-3">
              <label
                htmlFor="expirationTime"
                className="block pb-3 text-xl tracking-wider text-lightGreen"
              >
                Expiration Time
              </label>
              <input
                type="datetime-local"
                id="expirationTime"
                name="expirationTime"
                value={formData.expirationTime}
                onChange={handleInputChange}
                className="w-full rounded-full bg-lightBlur px-4 py-2 text-lightGreen placeholder-lightGreen focus:outline-none"
              />
            </div> */}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-fit rounded-full border border-darkGreen bg-mint py-4 px-6 text-sm uppercase tracking-wider text-darkGreen transition-colors hover:border-mint hover:bg-darkGreen hover:text-mint"
              onClick={handleSubmit}
            >
              {!isProcessing ? "Submit Request" : "Processing..."}
            </button>
          </div>
        </div>
      </BoxContainer>
    </div>
  );
};

export default Request;
