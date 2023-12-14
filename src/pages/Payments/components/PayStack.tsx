import React, { useState } from "react";
import axios from 'axios'; 
import { ActionTypes, useStoreDispatch } from "../../../store/AuthProvider";
import { PaystackButton } from "react-paystack";

const publicKey = "pk_test_b36ff5491441c3e96df774246fb7c1fa43313094"; // Replace with your Paystack public key
const verifyEndpoint = "https://api.paystack.co/transaction/verify/";

interface PaymentFormProps {
  calculatedPrice: number;
  productName: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ calculatedPrice, productName }) => {
  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);
  const storeDispatch = useStoreDispatch();

  const onSuccessCall = async (reference: any) => {
    try {
      const response = await axios.get(`${verifyEndpoint}${reference}`, {
        headers: {
          Authorization: `Bearer ${publicKey}`,
        },
      });

      // Check if the payment was successful
      if (response.data.data.status === 'success') {
        // Payment was successful
        setPaymentSuccessful(true);

        handlePaymentSuccess();
      } else {
        // Payment was not successful
        console.error('Payment verification failed:', response.data.message);
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error.message);
    }
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const handlePaymentSuccess = () => {
    // Dispatch your success action or handle success as needed
    storeDispatch({ type: ActionTypes.PAYMENT_SUCCESS, payload: {} });
  };

  return (
    <div>
      {isPaymentSuccessful ? (
        <div>
          <h2>Payment Successful</h2>
          <p>Thank you for your payment.</p>
        </div>
      ) : (
        <div>
          <div className="p-2 bg-slate-600 rounded-md flex items-end justify-center  text-white cursor-pointer">
          <PaystackButton
            text={`Pay NGN${calculatedPrice}`}
            className="paystack-button"
            onSuccess={() =>onSuccessCall} 
            onClose={onClose}
            reference={String(new Date().getTime())}
            email="customer@example.com"
            amount={calculatedPrice * 100} 
            publicKey={publicKey}
            tag="button"
          />
          </div>
        </div>
      )}
    </div>
  );
};

interface PaymentComponentProps {
  productName: string;
  calculatedPrice: number;
}

const PayStack: React.FC<PaymentComponentProps> = ({ productName, calculatedPrice }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="">Hall Name :</div>
        <div className="">{productName}</div>
      </div>
      <div className="flex gap-3">
        <div className="">Price :</div>
        <div className="">NGN{calculatedPrice}</div>
      </div>
      <PaymentForm calculatedPrice={calculatedPrice} productName={productName} />
    </div>
  );
};

export default PayStack;
