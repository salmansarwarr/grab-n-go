import React, { useState, useEffect, useCallback } from "react";
import OrderSuccessModal from "./OrderSuccessModal";
import { useAppKit } from "@reown/appkit/react";
import {
    useAccount,
    useDisconnect,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useSwitchChain,
    useWriteContract,
    useChainId,
    useConfig,
} from "wagmi";
import { parseEther, parseUnits } from "viem";
import { getAccount, watchAccount } from "@wagmi/core";

// Token contract addresses
const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
const USDC_ARBITRUM = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

// Recipient address (same for all chains)
const RECIPIENT_ADDRESS = "0x1366E85788027242E7CCA687c56A7c9d1b867034";

// ERC20 ABI for transfer function
const ERC20_ABI = [
    {
        type: "function",
        name: "transfer",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
];

export default function Checkout() {
    const [payment, setPayment] = useState("card");
    const [cryptoCurrency, setCryptoCurrency] = useState("ETH");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        card: "",
        exp: "",
        cvc: "",
    });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessingCrypto, setIsProcessingCrypto] = useState(false);
    const [detectedChainId, setDetectedChainId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSwitchingChain, setIsSwitchingChain] = useState(false);

    // Reown/Wagmi hooks
    const { open } = useAppKit();
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const config = useConfig();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();

    // Order calculation
    const orderItems = [
        {
            id: 1,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image1.png",
            price: 38.0,
            qty: 2,
        },
        {
            id: 2,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image2.png",
            price: 38.0,
            qty: 1,
        },
        {
            id: 3,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image3.png",
            price: 38.0,
            qty: 2,
        },
    ];
    
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = 5.75;
    const total = subtotal + deliveryFee;

    // Crypto prices for conversion
    const CRYPTO_PRICES = {
        ETH: 3000,
        USDT: 1,
        USDC: 1,
    };

    const getCryptoAmount = () => {
        return total / CRYPTO_PRICES[cryptoCurrency];
    };

    const getRequiredChainId = (currency = cryptoCurrency) => {
        switch (currency) {
            case "ETH":
                return 1; // Ethereum Mainnet
            case "USDT":
                return 56; // BSC
            case "USDC":
                return 42161; // Arbitrum
            default:
                return 1;
        }
    };

    const getNetworkName = (chainId) => {
        const networkNames = {
            1: "Ethereum Mainnet",
            56: "BSC",
            42161: "Arbitrum",
        };
        return networkNames[chainId] || `Chain ${chainId}`;
    };

    const requiredChainId = getRequiredChainId();
    const currentChain = detectedChainId || chainId;
    const isWrongNetwork = isConnected && currentChain !== requiredChainId;

    const {
        data: tokenHash,
        writeContract,
        isPending: isWritePending,
        error: tokenError,
        reset: resetWrite,
    } = useWriteContract();

    const {
        data: hash,
        sendTransaction,
        isPending: isSendPending,
        error: txError,
        reset: resetSend,
    } = useSendTransaction();

    const isPending = isSendPending || isWritePending;

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash: hash || tokenHash,
        });

    // Manual refresh function
    const refreshChainInfo = useCallback(async () => {
        if (!isConnected) return;

        setIsRefreshing(true);
        try {
            const account = getAccount(config);
            if (account.chainId) {
                setDetectedChainId(account.chainId);
            }
        } catch (error) {
            console.error("Error refreshing chain info:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [isConnected, config]);

    // Auto-refresh on connection
    useEffect(() => {
        if (isConnected) {
            refreshChainInfo();
        }
    }, [isConnected, refreshChainInfo]);

    // Watch for account changes
    useEffect(() => {
        if (!isConnected) return;

        const unwatch = watchAccount(config, {
            onChange(data) {
                if (data.chainId) {
                    setDetectedChainId(data.chainId);
                    setIsSwitchingChain(false);
                }
            },
        });

        return () => unwatch();
    }, [config, isConnected]);

    // Update detected chain when chainId changes
    useEffect(() => {
        if (chainId) {
            setDetectedChainId(chainId);
        }
    }, [chainId]);

    // Listen to window.ethereum events
    useEffect(() => {
        if (typeof window === "undefined" || !window.ethereum || !isConnected)
            return;

        const handleChainChanged = (chainIdHex) => {
            const newChainId = parseInt(chainIdHex, 16);
            setDetectedChainId(newChainId);
            setIsSwitchingChain(false);
        };

        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                refreshChainInfo();
            }
        };

        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    }, [isConnected, refreshChainInfo]);

    // Periodic polling
    useEffect(() => {
        if (!isConnected || payment !== "crypto") return;

        const interval = setInterval(() => {
            refreshChainInfo();
        }, 3000);

        return () => clearInterval(interval);
    }, [isConnected, payment, refreshChainInfo]);

    // Auto-select currency based on connected chain
    useEffect(() => {
        if (!isConnected || !currentChain) return;

        if (currentChain === 1 && cryptoCurrency !== "ETH") {
            setCryptoCurrency("ETH");
        } else if (currentChain === 56 && cryptoCurrency !== "USDT") {
            setCryptoCurrency("USDT");
        } else if (currentChain === 42161 && cryptoCurrency !== "USDC") {
            setCryptoCurrency("USDC");
        }
    }, [isConnected, currentChain, cryptoCurrency]);

    // Handle transaction errors
    useEffect(() => {
        const error = txError || tokenError;
        if (error) {
            console.error("Transaction error:", error);
            setErrors({
                crypto: error.message || "Transaction failed. Please try again.",
            });
            setIsProcessingCrypto(false);
        }
    }, [txError, tokenError]);

    // Watch for successful payment
    useEffect(() => {
        if (isConfirmed && isProcessingCrypto) {
            setShowSuccess(true);
            setIsProcessingCrypto(false);
        }
    }, [isConfirmed, isProcessingCrypto]);

    // Validation logic
    const validate = () => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = "First name is required.";
        if (!form.lastName) newErrors.lastName = "Last name is required.";
        if (!form.phone) newErrors.phone = "Phone number is required.";
        if (!form.email) newErrors.email = "Email is required.";
        if (payment === "card") {
            if (!form.card) newErrors.card = "Card number is required.";
            if (!form.exp) newErrors.exp = "Expiration date is required.";
            if (!form.cvc) newErrors.cvc = "CVC is required.";
        }
        if (payment === "crypto" && !isConnected) {
            newErrors.crypto = "Please connect your wallet first.";
        }
        return newErrors;
    };

    // Handle cryptocurrency change with auto chain switching
    const handleCryptoCurrencyChange = async (newCurrency) => {
        setCryptoCurrency(newCurrency);
        setErrors({});

        if (!isConnected) return;

        const requiredChainId = getRequiredChainId(newCurrency);
        const currentChain = detectedChainId || chainId;

        if (currentChain !== requiredChainId) {
            setIsSwitchingChain(true);
            try {
                await switchChain({ chainId: requiredChainId });
            } catch (switchError) {
                console.error("Auto chain switch failed:", switchError);
                setIsSwitchingChain(false);
                setErrors({
                    crypto: `Please manually switch to ${getNetworkName(
                        requiredChainId
                    )} in your wallet to use ${newCurrency}.`,
                });
            }
        }
    };

    const handleCryptoPayment = async () => {
        setIsProcessingCrypto(true);
        setErrors({});
        
        // Reset previous transactions
        resetWrite?.();
        resetSend?.();

        await refreshChainInfo();

        try {
            const requiredChainId = getRequiredChainId();
            const currentChain = detectedChainId || chainId;

            console.log("Payment Details:", {
                currency: cryptoCurrency,
                requiredChain: requiredChainId,
                currentChain: currentChain,
                total: total
            });

            if (currentChain !== requiredChainId) {
                setErrors({
                    crypto: `Please switch to ${getNetworkName(
                        requiredChainId
                    )} in your wallet and try again.`,
                });
                setIsProcessingCrypto(false);

                try {
                    await switchChain({ chainId: requiredChainId });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await refreshChainInfo();
                    return;
                } catch (switchError) {
                    console.error("Chain switch failed:", switchError);
                    setErrors({
                        crypto: `Please manually switch to ${getNetworkName(
                            requiredChainId
                        )} in your wallet and try again.`,
                    });
                    setIsProcessingCrypto(false);
                    return;
                }
            }

            if (cryptoCurrency === "ETH") {
                // For ETH, send the calculated amount
                const cryptoAmount = getCryptoAmount();
                const ethAmount = cryptoAmount.toString();
                
                console.log("Sending ETH:", ethAmount);
                
                sendTransaction({
                    to: RECIPIENT_ADDRESS,
                    value: parseEther(ethAmount),
                });
            } else if (cryptoCurrency === "USDT") {
                // USDT uses 18 decimals on BSC
                const cryptoAmount = getCryptoAmount();
                const usdtAmountString = cryptoAmount.toFixed(18);
                
                
                writeContract({
                    address: USDT_BSC,
                    abi: ERC20_ABI,
                    functionName: "transfer",
                    args: [
                        RECIPIENT_ADDRESS,
                        parseUnits("100", 18)
                    ],
                });
            } else if (cryptoCurrency === "USDC") {
                // USDC uses 6 decimals on Arbitrum
                const cryptoAmount = getCryptoAmount();
                const usdcAmountString = cryptoAmount.toFixed(6);
                
                
                writeContract({
                    address: USDC_ARBITRUM,
                    abi: ERC20_ABI,
                    functionName: "transfer",
                    args: [
                        RECIPIENT_ADDRESS,
                        parseUnits("1", 6)
                    ],
                });
            }
        } catch (error) {
            console.error("Crypto payment error:", error);
            setErrors({
                crypto: error.message || "Transaction failed. Please try again.",
            });
            setIsProcessingCrypto(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            if (payment === "crypto") {
                handleCryptoPayment();
            } else {
                setShowSuccess(true);
            }
        } else {
            setErrors(newErrors);
        }
    };

    // Prepare order data for modal
    const orderSuccessData = {
        code: `#${Math.floor(Math.random() * 10000)}_${Date.now()
            .toString()
            .slice(-5)}`,
        total: `$${total.toFixed(2)}`,
        payment:
            payment === "card"
                ? "Credit Card"
                : `Cryptocurrency (${cryptoCurrency})`,
        items: orderItems.map((i) => ({ image: i.image, qty: i.qty })),
        txHash: hash || tokenHash,
    };

    return (
        <>
            <div className="container checkout-page">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-section">
                        <h3>Personal information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>FIRST NAME</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            firstName: e.target.value,
                                        }))
                                    }
                                />
                                {errors.firstName && (
                                    <div className="input-error">
                                        {errors.firstName}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>LAST NAME</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            lastName: e.target.value,
                                        }))
                                    }
                                />
                                {errors.lastName && (
                                    <div className="input-error">
                                        {errors.lastName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>PHONE NUMBER</label>
                                <input
                                    type="text"
                                    placeholder="Phone number"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            phone: e.target.value,
                                        }))
                                    }
                                />
                                {errors.phone && (
                                    <div className="input-error">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                                {errors.email && (
                                    <div className="input-error">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="checkout-section">
                        <h3>Payment methods</h3>
                        <div className="payment-methods">
                            <label
                                className={payment === "card" ? "active" : ""}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === "card"}
                                    onChange={() => setPayment("card")}
                                />
                                <span>Pay by Credit Card</span>
                            </label>
                            <label
                                className={payment === "crypto" ? "active" : ""}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === "crypto"}
                                    onChange={() => setPayment("crypto")}
                                />
                                <span>Pay with Cryptocurrency</span>
                            </label>
                        </div>

                        {payment === "card" && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>CARD NUMBER</label>
                                        <input
                                            type="text"
                                            placeholder="1234 1234 1234"
                                            value={form.card}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    card: e.target.value,
                                                }))
                                            }
                                        />
                                        {errors.card && (
                                            <div className="input-error">
                                                {errors.card}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>EXPIRATION DATE</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={form.exp}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    exp: e.target.value,
                                                }))
                                            }
                                        />
                                        {errors.exp && (
                                            <div className="input-error">
                                                {errors.exp}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input
                                            type="text"
                                            placeholder="CVC code"
                                            value={form.cvc}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    cvc: e.target.value,
                                                }))
                                            }
                                        />
                                        {errors.cvc && (
                                            <div className="input-error">
                                                {errors.cvc}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {payment === "crypto" && (
                            <div className="crypto-payment-section">
                                <div className="form-group">
                                    <label>SELECT CRYPTOCURRENCY</label>
                                    <select
                                        value={cryptoCurrency}
                                        onChange={(e) =>
                                            handleCryptoCurrencyChange(
                                                e.target.value
                                            )
                                        }
                                        className="crypto-select"
                                        disabled={isSwitchingChain}
                                    >
                                        <option value="ETH">
                                            ETH (Ethereum Mainnet)
                                        </option>
                                        <option value="USDT">
                                            USDT (BEP20 - BSC)
                                        </option>
                                        <option value="USDC">
                                            USDC (Arbitrum)
                                        </option>
                                    </select>
                                    {isSwitchingChain && (
                                        <div
                                            style={{
                                                marginTop: "10px",
                                                color: "#666",
                                            }}
                                        >
                                            ⏳ Requesting network switch in your
                                            wallet...
                                        </div>
                                    )}
                                </div>

                                {!isConnected ? (
                                    <button
                                        type="button"
                                        className="connect-wallet-btn"
                                        onClick={() => open()}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="wallet-connected">
                                        <p>
                                            ✓ Wallet Connected:{" "}
                                            {address?.slice(0, 6)}...
                                            {address?.slice(-4)}
                                        </p>
                                        {currentChain && (
                                            <div>
                                                <p>
                                                    Current Network:{" "}
                                                    {getNetworkName(
                                                        currentChain
                                                    )}{" "}
                                                    (Chain ID: {currentChain})
                                                </p>
                                                <p>
                                                    Required Network:{" "}
                                                    {getNetworkName(
                                                        requiredChainId
                                                    )}{" "}
                                                    (Chain ID: {requiredChainId}
                                                    )
                                                </p>
                                                {isWrongNetwork &&
                                                    !isSwitchingChain && (
                                                        <div
                                                            className="network-warning"
                                                            style={{
                                                                backgroundColor:
                                                                    "#fff3cd",
                                                                padding: "10px",
                                                                borderRadius:
                                                                    "5px",
                                                                marginTop:
                                                                    "10px",
                                                                border: "1px solid #ffc107",
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    color: "#856404",
                                                                    fontWeight:
                                                                        "bold",
                                                                    margin: "5px 0",
                                                                }}
                                                            >
                                                                ⚠️ Wrong Network
                                                                Detected!
                                                            </p>
                                                            <p
                                                                style={{
                                                                    color: "#856404",
                                                                    fontSize:
                                                                        "14px",
                                                                    margin: "5px 0",
                                                                }}
                                                            >
                                                                Please switch to{" "}
                                                                {getNetworkName(
                                                                    requiredChainId
                                                                )}{" "}
                                                                in your wallet
                                                                to use{" "}
                                                                {cryptoCurrency}
                                                                .
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="disconnect-btn"
                                            onClick={() => disconnect()}
                                        >
                                            Disconnect
                                        </button>
                                        <div className="crypto-amount">
                                            <p>
                                                Amount: ${total.toFixed(2)} USD
                                            </p>
                                            <p>
                                                ≈ {getCryptoAmount().toFixed(6)}{" "}
                                                {cryptoCurrency}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {errors.crypto && (
                                    <div className="input-error">
                                        {errors.crypto}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        className="place-order-btn"
                        disabled={
                            isPending ||
                            isConfirming ||
                            (payment === "crypto" && isWrongNetwork) ||
                            isSwitchingChain
                        }
                        title={
                            isWrongNetwork
                                ? "Please switch to the correct network first"
                                : ""
                        }
                    >
                        {isSwitchingChain
                            ? "Switching Network..."
                            : isPending || isConfirming
                            ? "Processing..."
                            : "Place Order"}
                    </button>
                </form>
                <div className="order-summary">
                    <h3>Order summary</h3>
                    {orderItems.map((item, i) => (
                        <div className="summary-row" key={i}>
                            <div className="summary-product">
                                <div className="summary-product-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div>
                                    <div className="summary-title">
                                        {item.title}
                                    </div>
                                    <div className="summary-type">
                                        {item.type}
                                    </div>
                                    <button className="summary-remove">
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                            <div className="summary-price">
                                ${item.price.toFixed(2)}
                            </div>
                        </div>
                    ))}
                    <div className="summary-row subtotal">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <OrderSuccessModal
                open={showSuccess}
                onClose={() => setShowSuccess(false)}
                order={orderSuccessData}
            />
        </>
    );
}