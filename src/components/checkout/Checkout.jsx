import React, { useState, useEffect, useCallback } from "react";
import OrderSuccessModal from "./OrderSuccessModal";
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useWriteContract, useChainId, useConfig } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { getAccount, watchAccount } from '@wagmi/core';

// Token contract addresses
const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
const USDC_ARBITRUM = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

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
    const [cryptoCurrency, setCryptoCurrency] = useState("ETH"); // ETH, USDT, USDC
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
                console.log('Detected chain ID:', account.chainId);
            }
            
            // Also check if window.ethereum exists (for browser wallets)
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const currentChainId = await window.ethereum.request({ 
                        method: 'eth_chainId' 
                    });
                    const chainIdDecimal = parseInt(currentChainId, 16);
                    console.log('Chain ID from ethereum provider:', chainIdDecimal);
                    setDetectedChainId(chainIdDecimal);
                } catch (err) {
                    console.log('Could not get chain from window.ethereum:', err);
                }
            }
        } catch (error) {
            console.error('Error refreshing chain info:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [isConnected, config]);

    // Auto-refresh on mount and when connection changes
    useEffect(() => {
        if (isConnected) {
            refreshChainInfo();
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
                }
            },
        });

        return () => unwatch();
    }, [config, isConnected]);

    // Update detected chain when chainId changes
    useEffect(() => {
        if (chainId) {
            console.log('chainId hook updated:', chainId);
            setDetectedChainId(chainId);
        }
    }, [chainId]);

    // Listen to window.ethereum events (for WalletConnect/Trust Wallet)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum || !isConnected) return;

        const handleChainChanged = (chainIdHex) => {
            const newChainId = parseInt(chainIdHex, 16);
            console.log('Chain changed event:', newChainId);
            setDetectedChainId(newChainId);
        };

        const handleAccountsChanged = (accounts) => {
            console.log('Accounts changed:', accounts);
            if (accounts.length > 0) {
                refreshChainInfo();
            }
        };

        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [isConnected, refreshChainInfo]);

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
        return newErrors;
    };

    const getRequiredChainId = () => {
        switch (cryptoCurrency) {
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
            1: 'Ethereum Mainnet',
            56: 'BSC',
            42161: 'Arbitrum'
        };
        return networkNames[chainId] || `Chain ${chainId}`;
    };

    const getCryptoAmount = () => {
        const prices = {
            ETH: 3000, // 1 ETH = $3000
            USDT: 1,   // 1 USDT = $1
            USDC: 1,   // 1 USDC = $1
        };
    
        return total / prices[cryptoCurrency];
    };    

    const handleCryptoPayment = async () => {
        setIsProcessingCrypto(true);
        setErrors({});
        console.log('Initiating crypto payment');
        
        // Refresh chain info before payment
        await refreshChainInfo();
        
        try {
            const requiredChainId = getRequiredChainId();
            const currentChain = detectedChainId || chainId;
            
            // Check current chain
            console.log('Current chain:', currentChain, 'Required:', requiredChainId);
            
            // Check if user is on the correct chain
            if (currentChain !== requiredChainId) {
                console.log('Wrong network detected.');
                
                setErrors({ 
                    crypto: `Please switch to ${getNetworkName(requiredChainId)} in your wallet and try again.` 
                });
                setIsProcessingCrypto(false);
                
                // Try to request chain switch via wallet
                try {
                    await switchChain({ chainId: requiredChainId });
                    // Wait for chain switch confirmation
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Refresh to get new chain
                    await refreshChainInfo();
                    
                    return;
                } catch (switchError) {
                    console.error('Chain switch failed:', switchError);
                    setErrors({ 
                        crypto: `Please manually switch to ${getNetworkName(requiredChainId)} in your wallet and try again.` 
                    });
                    setIsProcessingCrypto(false);
                    return;
                }
            }

            if (cryptoCurrency === "ETH") {
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
                const tokenAddress = cryptoCurrency === "USDT" ? USDT_BSC : USDC_ARBITRUM;
                const decimals = 6; // Both USDT and USDC use 6 decimals
                const amount = getCryptoAmount().toFixed(decimals);
                
                console.log('Sending token transaction:', {
                    token: cryptoCurrency,
                    to: RECIPIENT_ADDRESS,
                    amount,
                    tokenAddress
                });
                
                writeContract({
                    address: tokenAddress,
                    abi: ERC20_ABI,
                    functionName: 'transfer',
                    args: [RECIPIENT_ADDRESS, parseUnits(amount, decimals)],
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
        payment: payment === "card" ? "Credit Card" : `Cryptocurrency (${cryptoCurrency})`,
        items: orderItems.map(i => ({ image: i.image, qty: i.qty })),
        txHash: hash || tokenHash,
    };

    const isPending = isSendPending || isWritePending;
    const requiredChainId = getRequiredChainId();
    const currentChain = detectedChainId || chainId;
    const isWrongNetwork = isConnected && currentChain !== requiredChainId;

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
                                <div className="form-group">
                                    <label>SELECT CRYPTOCURRENCY</label>
                                    <select 
                                        value={cryptoCurrency} 
                                        onChange={e => setCryptoCurrency(e.target.value)}
                                        className="crypto-select"
                                    >
                                        <option value="ETH">ETH (Ethereum Mainnet)</option>
                                        <option value="USDT">USDT (BEP20 - BSC)</option>
                                        <option value="USDC">USDC (Arbitrum)</option>
                                    </select>
                                </div>
                                
                                {!isConnected ? (
                                    <button type="button" className="connect-wallet-btn" onClick={() => open()}>
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="wallet-connected">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>✓ Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                                            {/* <button 
                                                type="button" 
                                                onClick={refreshChainInfo}
                                                disabled={isRefreshing}
                                                style={{
                                                    padding: '5px 10px',
                                                    fontSize: '12px',
                                                    cursor: isRefreshing ? 'not-allowed' : 'pointer',
                                                    backgroundColor: '#f0f0f0',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Network'}
                                            </button> */}
                                        </div>
                                        {currentChain && (
                                            <div>
                                                <p>Current Network: {getNetworkName(currentChain)} (Chain ID: {currentChain})</p>
                                                <p>Required Network: {getNetworkName(requiredChainId)} (Chain ID: {requiredChainId})</p>
                                                {isWrongNetwork && (
                                                    <div className="network-warning" style={{ 
                                                        backgroundColor: '#fff3cd', 
                                                        padding: '10px', 
                                                        borderRadius: '5px', 
                                                        marginTop: '10px',
                                                        border: '1px solid #ffc107'
                                                    }}>
                                                        <p style={{ color: '#856404', fontWeight: 'bold', margin: '5px 0' }}>
                                                            ⚠️ Wrong Network Detected!
                                                        </p>
                                                        <p style={{ color: '#856404', fontSize: '14px', margin: '5px 0' }}>
                                                            Please switch to {getNetworkName(requiredChainId)} in your Trust Wallet app.
                                                        </p>
                                                        <button 
                                                            type="button" 
                                                            className="switch-network-btn"
                                                            onClick={() => switchChain({ chainId: requiredChainId })}
                                                            style={{
                                                                marginTop: '10px',
                                                                padding: '8px 16px',
                                                                backgroundColor: '#ffc107',
                                                                border: 'none',
                                                                borderRadius: '5px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            Request Switch to {getNetworkName(requiredChainId)}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button type="button" className="disconnect-btn" onClick={() => disconnect()}>
                                            Disconnect
                                        </button>
                                        <div className="crypto-amount">
                                            <p>Amount: ${total.toFixed(2)} USD</p>
                                            <p>≈ {getCryptoAmount().toFixed(6)} {cryptoCurrency}</p>
                                        </div>
                                    </div>
                                )}
                                {errors.crypto && <div className="input-error">{errors.crypto}</div>}
                            </div>
                        )}
                    </div>
                    <button 
                        className="place-order-btn" 
                        disabled={isPending || isConfirming || (payment === "crypto" && isWrongNetwork)}
                        title={isWrongNetwork ? "Please switch to the correct network first" : ""}
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