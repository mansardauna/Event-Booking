import React, { useState } from "react";
import Modal from "react-modal";
import Button from "../../../components/UI/Button";
import PaymentComponent from "./CardPayment";
import FlutterwavePayment from "./Flatterwave";
import PaymentMethodModal from "./paymentMethod";
import PayStack from "./PayStack";

const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your Paystack public key

const PaymentModal: React.FC<{
  isOpen: boolean;
  onRequestClose: any;
  productName: string;
  calculatedPrice: number;
  showPaymentComponent: boolean;
  setShowPaymentComponent: (value: boolean) => void;
}> = ({ isOpen, onRequestClose, productName, calculatedPrice, showPaymentComponent, setShowPaymentComponent }) => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("stripe");

  const handlePaymentOptionChange = (option:string) => {
    setSelectedPaymentOption(option);
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful");
    onRequestClose(); // Close the modal or perform other actions
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Payment Modal"
      className="md:w-2/6 right-10 z-50 bottom-60 md:bottom-40 md:right-80 absolute gap-3 bg-slate-100 text-black p-4 rounded-md shadow-2xl flex flex-col"
    >
      <div className="w-fit m-auto mt-0 uppercase text-2xl font-light">Complete Your Booking</div>
      <div className="flex items-center justify-center gap-2">
        {/* Add PaymentMethodModal component */}
        <PaymentMethodModal onPaymentMethodSelected={(method: string) => handlePaymentOptionChange(method)} />
      </div>
      {selectedPaymentOption === "stripe" ? (
        <PaymentComponent
          productName={productName}
          calculatedPrice={calculatedPrice}
          showPaymentComponent={showPaymentComponent}
          setShowPaymentComponent={setShowPaymentComponent}
        />
      ) : selectedPaymentOption === "flutterwave" ? (
        <FlutterwavePayment amount={calculatedPrice} onCancel={onRequestClose} onSuccess={onRequestClose} />
      ) : (
        <PayStack productName={productName} calculatedPrice={calculatedPrice} />
      )}
      <Button variant="primary" onClick={onRequestClose} className="p-2 w-full m-auto rounded-lg bg-red-500 shadow-md text-white">
        Close
      </Button>
    </Modal>
  );
};

export default PaymentModal;
