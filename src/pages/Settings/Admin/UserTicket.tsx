import React, { useState } from 'react';
import Button from '../../../components/UI/Button';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import { ObjectId } from 'mongoose'; // Import ObjectId from mongoose

interface Review {
  username: string;
  rating: number;
  comment: string;
}

interface Facility {
  icon: string;
  title: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  videos: File[];
  images: File[];
  location: string;
  facilities: Facility[];
  rate: string;
  des: string;
  category: string;
  booking: any[];
  reviews: Review[]; // Updated to use the Review type
}



interface TicketData {
  booking: any[];
  product:Product
  productId: string;
}

const UserTicket: React.FC<TicketData> = ({ booking, productId, product }) => {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [notification, setNotification] = useState<any>(null);
  const { updateProduct, products } = useFetchProducts();
  const confirmTicket = (ticketId: number, phoneNumber: string, username: string, event: string, startDate: string, endDate: string, calculatedPrice: number) => {
    const confirmationMsg = `Confirm: Booking for ${username} - ${event}. Start Date: ${startDate}, End Date: ${endDate}. Price: NGN ${calculatedPrice}`;
    setConfirmationMessage(confirmationMsg);
  
  
    // Create the WhatsApp message link
    const message = `Confirmation for Ticket ${ticketId}: ${confirmationMsg}`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    window.open(whatsappLink);
  
    setTimeout(() => {
      setConfirmationMessage('');
    }, 5000);
  };
  
  const deleteTicket = (index: any) => {
    const updatedProduct: Product = { ...product };
    updatedProduct.booking.splice(index, 1);
  
    updateProduct(productId.toString(), updatedProduct)
    .then(() => {
        alert('Ticket deleted successfully!');
      })
      .catch((error:any) => {
        console.error('Error deleting Ticket:', error);
        alert('Ticket deletion failed.');
      });
  };
  
  const handleToggle = (ticketId: number) => {
    setSelectedTicket((prev) => (prev === ticketId ? null : ticketId));
  };

  const cancelTicket = (ticketId: number) => {
    console.log(`Ticket ${ticketId} canceled`);
  };

  return (
  <div>

      <div className="w-11/12">
        <div className="w-fit m-auto text-2xl font-light mb-2">Booked Tickets</div>
        <div className="h-80 overflow-auto p-2">
          {booking.map((ticket: any) => (
            <div key={ticket.id}>
              <div className="flex mt-2 gap-4">
                <div className="w-16">{ticket.username}</div>

                <Button
                  variant="primary"
                  className="py-0 rounded-md text-white"
                  onClick={() => handleToggle((ticket.id))}
                >
                  Ticket Detail
                </Button>

                <Button
  variant="primary"
  className="py-0 rounded-md text-white"
  onClick={() => confirmTicket(
    ticket.id,
    ticket.phoneNumber,
    ticket.username,
    ticket.event,
    ticket.startDate,
    ticket.endDate,
    ticket.calculatedPrice
  )}
>
  Confirm Ticket
</Button>
                <Button
                  variant="primary"
                  className="py-0 rounded-md bg-red-600 text-white"
                  onClick={() => deleteTicket( productId)}
                >
                  Delete
                </Button>

                <Button
                  variant="primary"
                  className="py-0 rounded-md text-white"
                  onClick={() => cancelTicket(ticket.id)}
                >
                  Cancel
                </Button>
              </div>

              {selectedTicket === ticket.id && (
                <div className="shadow-md rounded-md p-2">
                  <div className="flex gap-2">
                  <div className="uppercase w-40">Event type</div>
                    <div>{ticket.event}</div>
                  </div>
                  <div className="flex gap-2">
                  <div className="uppercase w-40">Phone Number</div>
                    <div>{ticket.phoneNumber}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="uppercase w-40">Start date</div>
                    <div>{ticket.startDate}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="uppercase w-40">End date</div>
                    <div>{ticket.endDate}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="uppercase w-40">Booked by</div>
                    <div>{ticket.username}</div>
                  </div>
                  <div className="">{ticket.calculatedPrice}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTicket;
