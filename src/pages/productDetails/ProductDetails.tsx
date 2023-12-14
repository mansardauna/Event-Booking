import React, { useEffect, useState } from "react";
import { CloseSquare, HeartAdd, Location, Star1 } from "iconsax-react";
import FacilityIcons from "../../components/ItemMap.tsx/icons";
import Button from "../../components/UI/Button";
import Display from "./components/Display";
import PaymentModal from "../Payments/components/PaymentModal";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import useFetchProducts from "../../Hooks/useFetchProduct";
import { ActionTypes, useStoreDispatch } from "../../store/AuthProvider";
import BookingSummary from "./components/BookingSummary";
import BookingForm from "./components/BookinForm";
import UserReview from "./components/Review";

interface InfoProps {
  productInfo: any;
}

interface Booking {
  id:string
  startDate: Date | null;
  endDate: Date | null;
  username: string;
  event: string;
  name:string;
  price: number;
  phoneNumber: string;
  calculatedPrice: number;
  productId : string;
  status: string


}

const ProductDetail: React.FC<InfoProps> = ({ productInfo }) => {
  const [bookedDates, setBookedDates] = useState<Booking[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [username, setUsername] = useState("User");
  const [event, setEventName] = useState("party");
  const [phoneNumber, setPhoneNumber]= useState('234...')  
  const [isInFavourites, setIsInFavourites] = useState(false);
  const [showPaymentComponent, setShowPaymentComponent] = useState(false);
  const [isBookVisible, setIsBookVisible] = useState(false);
  const {fetchUser, addBooking,deleteFromFav, addToFav } = useFetchProducts();

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [formattedStartDate, setFormattedStartDate] = useState<string | null>(null);
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);


  useEffect(() => {
    const fetchLogin = async () => {
      try {
        // Fetch the username from localStorage
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
          const userLogin = await fetchUser(storedToken);
          setUsername(userLogin.user?.username || 'User');
        }
      } catch (error) {
        console.error('Error fetching login information:', error);
      }
    };

    fetchLogin();
  }, [fetchUser]);



  const toggleFavourites = async () => {
    setIsInFavourites(!isInFavourites);
  
    try {
      const productId = productInfo._id;
  
      if (!isInFavourites) {
        await addToFav (productId, productInfo);
        
      } else {
        await deleteFromFav(productId);
        
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
    }
  };

  const handlePaymentComplete = async () => {
    const productId = productInfo._id;
      const BookID = uuidv4()
    const bookingData: Booking = {
      id:BookID,
      username,
      event,
      name:'',
      price:0,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      phoneNumber,
      calculatedPrice,
      productId,
      status:'Active',

    };
    try {
      const productId = productInfo._id;
      await addBooking(productId.toString(), bookingData);
  
      console.log('Booking added successfully');
    } catch (error) {
      console.error('Error adding booking:', error);
    }
    setShowPaymentComponent(false);
  };
  

 

  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
    if (date) {
      const formattedDate = moment(date).format("YYYY-MM-DD HH:mm A");
      setFormattedStartDate(formattedDate);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
    if (date) {
      const formattedDate = moment(date).format("YYYY-MM-DD HH:mm A");
      setFormattedEndDate(formattedDate);
    }
  };

  const handleBookRoom = () => {
    setIsBooked(!isBooked);
    if (selectedStartDate && selectedEndDate) {
      const startDateTime = moment(selectedStartDate).startOf("day");
      const endDateTime = moment(selectedEndDate).startOf("day");
      const daysDifference = endDateTime.diff(startDateTime, 'days');

      if (daysDifference < 0) {
        alert("End date cannot be before the start date.");
        return;
      }
      const BookID = uuidv4()
      const productId = productInfo._id;

      const price = productInfo.price * (daysDifference + 1);
      setBookedDates([
        ...bookedDates,
        { startDate: startDateTime.toDate(), endDate: endDateTime.toDate(), event, username, phoneNumber,   calculatedPrice, productId, 
          price,
          name:'',
          status:'Active', id:BookID},
      ]);
      setIsBooked(true);
      setCalculatedPrice(price);
    } else {
      alert("Please select both a start date and an end date.");
    }
  };

  const handlePayment = () => {
    setShowPaymentComponent(true);
    setIsBookVisible(!true);
  };

  const media = [
    { type: "image", url: productInfo.images[0], alt: productInfo.name },
    { type: "video", url: productInfo.videos[0], alt: productInfo.name },
  ];

  return (
    <div className="relative w-full p-2">

      <div className="flex w-full m-auto md:flex-row flex-col gap-3 mt-4">
        <div className="md:w-1/2 w-full md:my-2 md:mx-0 my-2 mx-auto px-3">
          <Display media={media} />
        </div>
        <div className="md:w-1/3 mt-5 px-5 md:p-0 flex-col flex gap-3">
          <div className="flex justify-between">
            <h2 className="text-4xl font-semibold">{productInfo.name}</h2>
            <div className="flex items-center cursor-pointer gap-1">
              <Star1 size={17} color={"gold"} />
              <div className="font-semibold">{productInfo.rate}</div>
              <div className="star">star</div>
            </div>
          </div>
          <div>
            <span className="text-green-700 font-semibold text-xl">NGN</span>
            <span className="text-lg">{' '}{productInfo.price}{' '}</span>
            <span className="text-gray-400 font-light text-sm">/Day</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Location size={20} color="red" />
              <div className="location text-lg">{productInfo.location}</div>
            </div>
            <Button
              variant="primary"
              className="flex rounded-md items-center text-white gap-1"
              onClick={toggleFavourites}
            >
              <HeartAdd size={14} />
              <div className="text-xs">
                {isInFavourites? "Remove from Favourites" : "Add to Favourites"}
              </div>
            </Button>
          </div>
          <div className="flex-col flex mt-3">
            <div className="des font-semibold">Description</div>
            <p className="text-base text-gray-600 w-95 text-justify">
              {productInfo.des}
            </p>
          </div>
          <div>
            <div className="font-semibold">Facilities</div>
            <div className="flex justify-between gap-3 mt-2">
              {productInfo.facilities.map((item: any) => (
                <div key={item.index}>
                  <FacilityIcons iconName={item.title} /> {item.title}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsBookVisible(!isBookVisible)}
            className="w-fit m-auto bg-slate-600 rounded-md text-white"
          >
            {isBookVisible ? "Cancel Booking" : "Book Date"}
          </Button>
        </div>
      </div>
      <UserReview product={productInfo} productId={productInfo._id}/>

      {isBookVisible && (
        <div className="top-28 md:top-16 right-0 bottom-0 border bg-gray-300 p-2 items-center h-full md:w-1/4 w-full fixed md:z-10 z-50">
          <CloseSquare
            color="gray"
            onClick={() => setIsBookVisible(!isBookVisible)}
          />
          {isBooked ? (
            <BookingSummary username={username} event={event} formattedEndDate={formattedEndDate} phoneNumber={phoneNumber} formattedStartDate={formattedStartDate} calculatedPrice={calculatedPrice} 
            handlePayment={handlePayment} />
          ) : (
           <BookingForm username={username} event={event} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} selectedEndDate={selectedEndDate} selectedStartDate={selectedStartDate} handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} handleBookRoom={handleBookRoom} setEventName={setEventName} setUsername={setUsername}/>
          )}
        </div>
      )}
      <PaymentModal
        productName={productInfo.name}
        calculatedPrice={calculatedPrice}
        isOpen={showPaymentComponent}
        onRequestClose={handlePaymentComplete}
        showPaymentComponent={showPaymentComponent}
        setShowPaymentComponent={setShowPaymentComponent}
      />

    </div>
  );
};

export default ProductDetail;