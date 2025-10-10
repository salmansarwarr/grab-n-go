import React, { useState, useEffect, useCallback } from "react";
import OrderSuccessModal from "./OrderSuccessModal";
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useWriteContract, useChainId, useConfig } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { getAccount, watchAccount } from '@wagmi/core';

// Accepted tokens and their configurations
const ACCEPTED_TOKENS = {
  ETH: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    native: true,
    decimals: 18
  },
  USDT: {
    chainId: 56,
    chainName: 'BSC',
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18
  },
  USDC: {
    chainId: 42161,
    chainName: 'Arbitrum',
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6
  }
};

// Recipient address (same for all chains)
const RECIPIENT_ADDRESS = "0x1366E85788027242E7CCA687c56A7c9d1b867034";

// ERC20 ABI for transfer function
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Checkout() {
    const [payment, setPayment] = useState("card");
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
    const [detectedToken, setDetectedToken] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Reown/Wagmi hooks
    const { open } = useAppKit();
    const { address, isConnected, chain } = useAccount();
    const chainId = useChainId();
    const config = useConfig();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    
    // For native token transfers (ETH)
    const { data: hash, sendTransaction, isPending: isSendPending, error: txError } = useSendTransaction();
    
    // For ERC20 token transfers (USDT, USDC)
    const { data: tokenHash, writeContract, isPending: isWritePending, error: tokenError } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash || tokenHash,
    });

    // Detect which token is being used based on chain ID
    const detectTokenFromChain = useCallback((chainId) => {
        for (const [token, config] of Object.entries(ACCEPTED_TOKENS)) {
            if (config.chainId === chainId) {
                return token;
            }
        }
        return null;
    }, []);

    // Manual refresh function to detect chain changes
    const refreshChainInfo = useCallback(async () => {
        if (!isConnected) return;
        
        setIsRefreshing(true);
        try {
            // Get fresh account info from wagmi core
            const account = getAccount(config);
            console.log('Refreshed account info:', account);
            
            if (account.chainId) {
                setDetectedChainId(account.chainId);
                const token = detectTokenFromChain(account.chainId);
                setDetectedToken(token);
                console.log('Detected chain ID:', account.chainId, 'Token:', token);
            }
        } catch (error) {
            console.error('Error refreshing chain info:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [isConnected, config, detectTokenFromChain]);

    // Auto-refresh on mount and when connection changes
    useEffect(() => {
        if (isConnected) {
            refreshChainInfo();
        } else {
            setDetectedToken(null);
        }
    }, [isConnected, refreshChainInfo]);

    // Watch for account changes using wagmi core
    useEffect(() => {
        if (!isConnected) return;

        const unwatch = watchAccount(config, {
            onChange(data) {
                console.log('Account changed:', data);
                if (data.chainId) {
                    setDetectedChainId(data.chainId);
                    const token = detectTokenFromChain(data.chainId);
                    setDetectedToken(token);
                }
            },
        });

        return () => unwatch();
    }, [config, isConnected, detectTokenFromChain]);

    // Update detected chain when chainId changes
    useEffect(() => {
        if (chainId) {
            console.log('chainId hook updated:', chainId);
            setDetectedChainId(chainId);
            const token = detectTokenFromChain(chainId);
            setDetectedToken(token);
        }
    }, [chainId, detectTokenFromChain]);

    // Listen to window.ethereum events (for WalletConnect/Trust Wallet)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum || !isConnected) return;

        const handleChainChanged = (chainIdHex) => {
            const newChainId = parseInt(chainIdHex, 16);
            console.log('Chain changed event:', newChainId);
            setDetectedChainId(newChainId);
            const token = detectTokenFromChain(newChainId);
            setDetectedToken(token);
        };

        const handleAccountsChanged = (accounts) => {
            console.log('Accounts changed:', accounts);
            if (accounts.length > 0) {
                refreshChainInfo();
            } else {
                setDetectedToken(null);
            }
        };

        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [isConnected, refreshChainInfo, detectTokenFromChain]);

    // Periodic polling as fallback (for mobile wallets that don't emit events)
    useEffect(() => {
        if (!isConnected || payment !== "crypto") return;

        const interval = setInterval(() => {
            console.log('Polling for chain changes...');
            refreshChainInfo();
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [isConnected, payment, refreshChainInfo]);

    // Combined transaction error handling
    useEffect(() => {
        const error = txError || tokenError;
        if (error) {
            console.error("Transaction error:", error);
            setErrors({ crypto: error.message || "Transaction failed. Please try again." });
            setIsProcessingCrypto(false);
        }
    }, [txError, tokenError]);

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
    const subtotal = 99.0;
    const total = 234.0;

    // Watch for successful crypto payment
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
        if (payment === "crypto" && isConnected && !detectedToken) {
            newErrors.crypto = "Unsupported network. Please switch to Ethereum, BSC, or Arbitrum.";
        }
        return newErrors;
    };

    const getCryptoAmount = () => {
        if (!detectedToken) return 0;
        
        const prices = {
            ETH: 3000, // 1 ETH = $3000
            USDT: 1,   // 1 USDT = $1
            USDC: 1,   // 1 USDC = $1
        };
    
        return total / prices[detectedToken];
    };    

    const handleCryptoPayment = async () => {
        if (!detectedToken) {
            setErrors({ crypto: "No supported token detected. Please switch to a supported network." });
            return;
        }

        setIsProcessingCrypto(true);
        setErrors({});
        console.log('Initiating crypto payment with token:', detectedToken);
        
        // Refresh chain info before payment
        await refreshChainInfo();
        
        try {
            const tokenConfig = ACCEPTED_TOKENS[detectedToken];
            
            if (detectedToken === "ETH") {
                // Native ETH transfer
                const ethAmount = getCryptoAmount().toFixed(6);
                console.log('Sending ETH transaction:', {
                    to: RECIPIENT_ADDRESS,
                    value: parseEther(ethAmount),
                    ethAmount
                });
                
                sendTransaction({
                    to: RECIPIENT_ADDRESS,
                    value: parseEther(ethAmount),
                });
            } else {
                // ERC20 token transfer (USDT or USDC)
                const amount = getCryptoAmount().toFixed(tokenConfig.decimals);
                
                console.log('Sending token transaction:', {
                    token: detectedToken,
                    to: RECIPIENT_ADDRESS,
                    amount,
                    tokenAddress: tokenConfig.address
                });
                
                writeContract({
                    address: tokenConfig.address,
                    abi: ERC20_ABI,
                    functionName: 'transfer',
                    args: [RECIPIENT_ADDRESS, parseUnits(amount, tokenConfig.decimals)],
                });
            }
            
            console.log('Transaction initiated');
        } catch (error) {
            console.error("Crypto payment error:", error);
            setErrors({ crypto: error.message || "Transaction failed. Please try again." });
            setIsProcessingCrypto(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        console.log(newErrors);
        
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
        code: `#${Math.floor(Math.random() * 10000)}_${Date.now().toString().slice(-5)}`,
        total: `$${(total * 5.75).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        payment: payment === "card" ? "Credit Card" : `Cryptocurrency (${detectedToken || 'Unknown'})`,
        items: orderItems.map(i => ({ image: i.image, qty: i.qty })),
        txHash: hash || tokenHash,
    };

    const isPending = isSendPending || isWritePending;
    const isWrongNetwork = isConnected && !detectedToken;

    return (
        <>
            <div className="container checkout-page">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-section">
                        <h3>Personal information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>FIRST NAME</label>
                                <input type="text" placeholder="First name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                                {errors.firstName && <div className="input-error">{errors.firstName}</div>}
                            </div>
                            <div className="form-group">
                                <label>LAST NAME</label>
                                <input type="text" placeholder="Last name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                                {errors.lastName && <div className="input-error">{errors.lastName}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>PHONE NUMBER</label>
                                <input type="text" placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                {errors.phone && <div className="input-error">{errors.phone}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                {errors.email && <div className="input-error">{errors.email}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="checkout-section">
                        <h3>Payment methods</h3>
                        <div className="payment-methods">
                            <label className={payment === "card" ? "active" : ""}>
                                <input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} />
                                <span>Pay by Credit Card</span>
                            </label>
                            <label className={payment === "crypto" ? "active" : ""}>
                                <input type="radio" name="payment" checked={payment === "crypto"} onChange={() => setPayment("crypto")} />
                                <span>Pay with Cryptocurrency</span>
                            </label>
                        </div>
                        
                        {payment === "card" && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>CARD NUMBER</label>
                                        <input type="text" placeholder="1234 1234 1234" value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} />
                                        {errors.card && <div className="input-error">{errors.card}</div>}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>EXPIRATION DATE</label>
                                        <input type="text" placeholder="MM/YY" value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} />
                                        {errors.exp && <div className="input-error">{errors.exp}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input type="text" placeholder="CVC code" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} />
                                        {errors.cvc && <div className="input-error">{errors.cvc}</div>}
                                    </div>
                                </div>
                            </>
                        )}

                        {payment === "crypto" && (
                            <div className="crypto-payment-section">
                                <div className="accepted-tokens-info">
                                    <h4>Accepted Cryptocurrencies</h4>
                                    <div className="token-list">
                                        <div className="token-item">
                                            <strong>ETH</strong> - Ethereum Mainnet
                                        </div>
                                        <div className="token-item">
                                            <strong>USDT</strong> - BSC (BEP20)
                                        </div>
                                        <div className="token-item">
                                            <strong>USDC</strong> - Arbitrum
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                                        Connect your wallet on any supported network to pay with the native token.
                                    </p>
                                </div>
                                
                                {!isConnected ? (
                                    <button type="button" className="connect-wallet-btn" onClick={() => open()}>
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="wallet-connected">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>✓ Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                                        </div>
                                        
                                        {detectedChainId && (
                                            <div className="network-info">
                                                <p>
                                                    Current Network: {ACCEPTED_TOKENS[detectedToken]?.chainName || 'Unknown'} 
                                                    {detectedToken && ` (${detectedToken})`}
                                                </p>
                                                {detectedToken ? (
                                                    <div className="detected-token" style={{ 
                                                        backgroundColor: '#d4edda', 
                                                        padding: '10px', 
                                                        borderRadius: '5px', 
                                                        marginTop: '10px',
                                                        border: '1px solid #c3e6cb'
                                                    }}>
                                                        <p style={{ color: '#155724', fontWeight: 'bold', margin: '5px 0' }}>
                                                            ✓ {detectedToken} Detected
                                                        </p>
                                                        <p style={{ color: '#155724', fontSize: '14px', margin: '5px 0' }}>
                                                            Ready to accept payment in {detectedToken}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="unsupported-network" style={{ 
                                                        backgroundColor: '#f8d7da', 
                                                        padding: '10px', 
                                                        borderRadius: '5px', 
                                                        marginTop: '10px',
                                                        border: '1px solid #f5c6cb'
                                                    }}>
                                                        <p style={{ color: '#721c24', fontWeight: 'bold', margin: '5px 0' }}>
                                                            ⚠️ Unsupported Network
                                                        </p>
                                                        <p style={{ color: '#721c24', fontSize: '14px', margin: '5px 0' }}>
                                                            Please switch to Ethereum, BSC, or Arbitrum in your wallet.
                                                        </p>
                                                        <div className="supported-networks-buttons" style={{ marginTop: '10px' }}>
                                                            {Object.entries(ACCEPTED_TOKENS).map(([token, config]) => (
                                                                <button
                                                                    key={token}
                                                                    type="button"
                                                                    onClick={() => switchChain({ chainId: config.chainId })}
                                                                    style={{
                                                                        marginRight: '10px',
                                                                        marginBottom: '5px',
                                                                        padding: '8px 12px',
                                                                        backgroundColor: '#007bff',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    Switch to {config.chainName}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <button type="button" className="disconnect-btn" onClick={() => disconnect()}>
                                            Disconnect
                                        </button>
                                        
                                        {detectedToken && (
                                            <div className="crypto-amount">
                                                <p>Amount: ${total.toFixed(2)} USD</p>
                                                <p>≈ {getCryptoAmount().toFixed(6)} {detectedToken}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {errors.crypto && <div className="input-error">{errors.crypto}</div>}
                            </div>
                        )}
                    </div>
                    <button 
                        className="place-order-btn" 
                        disabled={isPending || isConfirming || (payment === "crypto" && (!isConnected || !detectedToken))}
                        title={!detectedToken && payment === "crypto" ? "Please connect to a supported network first" : ""}
                    >
                        {isPending || isConfirming ? "Processing..." : "Place Order"}
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
                                    <div className="summary-title">{item.title}</div>
                                    <div className="summary-type">{item.type}</div>
                                    <button className="summary-remove">✕ Remove</button>
                                </div>
                            </div>
                            <div className="summary-price">${item.price.toFixed(2)}</div>
                        </div>
                    ))}
                    <div className="summary-row subtotal">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <OrderSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} order={orderSuccessData} />
        </>
    );
}