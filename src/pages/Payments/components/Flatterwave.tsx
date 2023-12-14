import React, { useState } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button";

interface FlutterwavePaymentProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onCancel: (paymentData: any) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({ amount, onSuccess, onCancel }) => {
  const flutterwaveConfig = {
    public_key: 'FLWPUBK_TEST-88ee5986e8e0b2cebdc737f6d700270b-X', // Replace with your Flutterwave public key
    tx_ref: Date.now().toString(), // A unique transaction reference
    amount: amount, // The amount to be paid
    currency: "NGN", // The currency
    payment_type: "card", 
    redirect_url: "http://localhost:3000/product",  
  };

  const initiatePayment = async () => {
    try {
      const response = await axios.post(
        "https://api.flutterwave.com/v3/charges?type=card",
        flutterwaveConfig,
        {
          headers: {
            Authorization: `FLWSECK_TEST-afddfddeeffc5659dc11960a2e05f124-X`, 
          },
        }
      );

      const paymentData = response.data;

      if (paymentData.status === "success") {
        // Payment was successful
        // Now, verify the payment status
        await verifyPayment(paymentData.data.flw_ref);

        // If verification is successful, call the onSuccess callback
        onSuccess(paymentData);
      } else {
        // Payment was not successful
        onCancel(paymentData);
      }
    } catch (error) {
      // Handle any errors
      console.error("Flutterwave payment error:", error);
      onCancel({ status: "error", message: "Payment failed" });
    }
  };

  const verifyPayment = async (flwRef: string) => {
    try {
      const verifyResponse = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${flwRef}/verify`,
        {
          headers: {
            Authorization: `FLWSECK_TEST-fdbf7027ec3220d19c3a53b5d60fe1f7-X`, // Replace with your Flutterwave secret key
          },
        }
      );

      const verificationData = verifyResponse.data;

      if (verificationData.status === "success") {
        // Payment verification was successful
        console.log("Payment verification successful:", verificationData);
        return true;
      } else {
        // Payment verification failed
        console.error("Payment verification failed:", verificationData);
        return false;
      }
    } catch (error) {
      // Handle any errors during verification
      console.error("Payment verification error:", error);
      return false;
    }
  };

  return (
    <div>
      <Button variant="primary" className=" bg-yellow-500 text-black rounded-lg hover:text-white border-none shadow-md w-full" onClick={initiatePayment}>Pay with Flutterwave</Button>
    </div>
  );
};

export default FlutterwavePayment;
