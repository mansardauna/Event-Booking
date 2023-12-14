import React, { useEffect, useState } from "react";
import Button from "../../../components/UI/Button";
import { ActionTypes, ActionTypes as OrebiActionTypes, useStore } from "../../../store/AuthProvider";

import QRCode from "qrcode.react";
import Modal from "react-modal";
import { Printer, Ticket } from "iconsax-react";
import useFetchProducts from "../../../Hooks/useFetchProduct";

Modal.setAppElement("#root");

interface Booking {
  id:string
  startDate: Date | null ;
  endDate: Date | null;
  username: string;
  event: string;
  price: number
  name:string;
  calculatedPrice: number;
  phoneNumber: string;
  productId : string;
  status: string
}

const PaymentTicket: React.FC = () => {
  const { state } = useStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<Booking[]>([]);

  const {
  
    fetchBookingHistory,
    deleteBooking,
    fetchUser,
  } = useFetchProducts();

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          const userLogin = await fetchUser(storedToken);
          setUsername(userLogin.user?.username || null);

        }
      } catch (error) {
        console.error('Error fetching login information:', error);
      }
    };

    fetchLogin();
  }, [fetchUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        // Fetch user and booking history when the component mounts

        const bookingHistoryData = await fetchBookingHistory(username);
        const orderHistoryData = bookingHistoryData?.orderHistory || [];
        setOrderHistory(orderHistoryData);
      }
    };

    fetchData();
  }, [fetchUser, fetchBookingHistory, username]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleBack = () => {
    setSelectedItemId(null);
    closeModal();
  };

  const removeFromOrderHistory = (itemId: string) => {
    // Implement your logic to remove from order history
  };

  const beforePrint = () => {
    const buttons = document.querySelectorAll(".exclude-on-print");
    buttons.forEach((button) => {
      button.classList.add("hidden");
    });
  };

  const afterPrint = () => {
    const buttons = document.querySelectorAll(".exclude-on-print");
    buttons.forEach((button) => {
      button.classList.remove("hidden");
    });
  };

  const printTicket = () => {
    beforePrint();
    window.print();
    afterPrint();
  };

  const cancelBooking = (itemId: string) => {
    if (username) {
      const canceledBooking = orderHistory.find((item: any) => item.id === itemId);
      if (canceledBooking) {
        // Implement your logic for canceling booking
      }
    }
  };

  const toggleDatesVisibility = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };

  if (orderHistory.length === 0) {
    return (
      <>
        <div
          className="md:w-52 md:h-40 p-2 md:shadow-lg border text-2xl md:text-3xl bg-transparent md:text-center cursor-pointer rounded-md"
          onClick={openModal}
        >
          <div className=" items-center flex md:flex-col gap-3 md:mt-5">
            <Ticket className="md:text-5xl" />
            <span className="text-2xl"> No Ticket History</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="">
      <div
        className="md:w-52 md:h-40 p-2 md:shadow-lg border text-2xl md:text-3xl flex flex-col gap-3 bg-transparent md:text-center cursor-pointer rounded-md"
        onClick={openModal}
      >
        <div className=" items-center flex md:flex-col gap-3 md:mt-5">
          <Ticket className="md:text-5xl" />
          <span className="text-2xl">Ticket History</span>
        </div>
        <span className=" text-sm"> You have {orderHistory.length} Tickets</span>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="ticket  Modal"
        className="absolute border md:right-80 right-10 bg-white  md:w-5/12 h-60 overflow-auto p-2 bottom-60"
      >
        {orderHistory.map((item: Booking) => (
          <div key={item.id}>
            <div>
              <div className="p-2 flex gap-3 border-b justify-between">
                <div className="flex justify-between gap-2">
                  <span className="w-20">{item.name}</span>
                  <span className=" text-gray-400 italic">N{item.price}</span>
                </div>
                <Button
                  variant="primary"
                  onClick={() => toggleDatesVisibility(item.id)}
                  className="rounded-xl p-1 py-0 text-sm text-white"
                >
                  {selectedItemId === item.id ? "Hide Dates" : "View Dates"}
                </Button>
                {selectedItemId === item.id && (
                  <div className=" p-2 md:w-1/4 border md:right-0 top-32 md:top-16 md:h-fit h-5/6 justify-between  flex flex-col gap-5 bg-white right-4 w-11/12 fixed">
                    <Button
                      variant="secondary"
                      onClick={printTicket}
                      className="rounded-2xl absolute button left-0 bg-slate-300 shadow-md"
                    >
                      <Printer />
                    </Button>
                    <QRCode value="YourTicketDataHere" className=" m-auto" />
                    <div className="border rounded-md p-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase">Name</span>
                        <span className="w-20">{item.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase">Booked For</span>
                        <span className="w-20">{item.event}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase">Booked By</span>
                        <span className="w-20">{item.username}</span>
                      </div>
                    </div>
                    <div className="">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 uppercase">Start Date</span>{" "}
                        <span className="p-2 bg-zinc-200 rounded-lg">
                          <>
                          {" "}
                          {item.startDate }
                          </>
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 ">
                        <span className="text-gray-400 uppercase"> End Date</span>
                        <span className="p-2 bg-zinc-200 rounded-lg">
                          <>
                          {" "}
                          {item.endDate }
                          </>
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase">Price</span>
                        <span className="">NGN{item.price}/Day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase">Total Price</span>
                        <span className="">NGN{item.calculatedPrice}</span>
                      </div>
                    </div>
                    <div className=" flex flex-col gap-4 justify-center">
                      <Button
                        variant="primary"
                        onClick={() => handleBack()}
                        className="rounded-2xl shadow-md  w-full button text-white "
                      >
                        Back
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          cancelBooking(item.id);
                          handleBack();
                        }}
                        className=" rounded-2xl md:w-full button bg-slate-300 shadow-md"
                      >
                        Cancel Booking
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => removeFromOrderHistory(item.id)}
                        className=" rounded-2xl md:w-full bg-slate-300 shadow-md"
                      >
                        Delete Ticket
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default PaymentTicket;
