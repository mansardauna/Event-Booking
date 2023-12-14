// PaymentMethodModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import Button from "../../../components/UI/Button";
import { MoneyChange } from 'iconsax-react';

interface PaymentMethodSelectionProps {
  onPaymentMethodSelected: (method: string) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({ onPaymentMethodSelected }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePaymentMethodSelected = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodSelected(method);
    
  };

  return (
    <div className='md:w-1/2 m-auto p-2'>
      <div className='text-2xl w-fit m-auto text-center mb-2'>Select a Payment Method</div>
      <div className='flex flex-col gap-2 text-white mt-2'>
        <Button variant='primary' onClick={() => handlePaymentMethodSelected('stripe')}>Stripe</Button>
        <Button variant='primary' onClick={() => handlePaymentMethodSelected('flutterwave')}>Flatterwave</Button>
        <Button variant='primary' onClick={() => handlePaymentMethodSelected('paystack')}>Paystack</Button>
      </div>
      <div>
        {selectedMethod && <p>Selected Payment Method: {selectedMethod}</p>}
      </div>
    </div>
  );
};

Modal.setAppElement('#root'); // Set the root element for the modal

interface PaymentMethodModalProps {
  onPaymentMethodSelected: (method: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ onPaymentMethodSelected }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className='  md:rounded-md w-fit bg-transparent border p-2 cursor-pointer text-center flex md:flex-col justify-between bg-slate-500' onClick={openModal}>
        <div className='items-center flex md:flex-col gap-3'>
          <span className='text-xs text-gray-700'>Payment Method</span>
        </div>
        <div className="">
          {selectedPaymentMethod && (
            <>
              <p className='md:block hidden'>Selected Method: {selectedPaymentMethod}</p>
              <p className='md:hidden text-gray-400'>{selectedPaymentMethod}</p>
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Method Modal"
        className='absolute border md:right-52 right-10 bg-white md:w-6/12 p-2 bottom-60'
      >
        <PaymentMethodSelection onPaymentMethodSelected={onPaymentMethodSelected} />
        <Button variant='secondary' onClick={closeModal} className="w-full text-center">Close</Button>
      </Modal>
    </>
  );
};

export default PaymentMethodModal;
