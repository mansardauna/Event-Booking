import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStoreDispatch } from '../store/AuthProvider';


interface Facility {
  icon: string;
  title: string;
}
interface Booking {
  id:string
  startDate: Date | null ;
  endDate: Date | null;
  username: string;
  event: string;
  name:string;
  price: number;
  calculatedPrice: number;
  phoneNumber: string;
  productId : string;
  status: string
}

interface User {
  username: string;
  password: string;

}
interface UserLogging {
  username: string;
  password: string;
  favourites: any [];

}


interface ProductWithImageLink extends Product {
  imageLink?: string;
}

interface Product {
  id: string;  
  name: string;
  price: number;
  videos: File[];
  images: any[];
  location: string;
  facilities: Facility[];
  rate: string;
  des: string;
  category: string;
  booking: Booking[];
  reviews: any[];
  passcode: string;
}
interface UserResult {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: (username: string) => Promise<UserResult>;
}



interface FetchProductsResult {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: Error | null;
  filterByPrice: (minPrice: number, maxPrice: number) => void;
  filterByLocation: (location: string) => void;
  filterByFacilities: (selectedFacilities: string[]) => void;
  updateProduct: (productId: string,updatedProductData: any)    => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
  addProduct: (newProduct: Product) => Promise<void>;
  login: (user: UserLogging) => Promise<void>;
  fetchUser: (username: string) =>  Promise<UserResult>;
  signup: (user: User) => Promise<void>;
  deleteTicket: (productId: string, ticketId: number) => Promise<void>; addBooking: (productId: string, bookingData: Booking) => Promise<void>;
  deleteBooking: (productId: string, bookingId: string) => Promise<void>;
  fetchBookingHistory: (username:string) =>  Promise<{ orderHistory: Booking[]; loadingOrderHistory: boolean; errorOrderHistory: Error | null; fetchBookingHistory: any; }>
  addToFav: (productId:string, product:Product) => Promise<void>;
  deleteFromFav: (productId:string) => Promise<void>
  fetchUserFavorites:(user: UserLogging) => Promise<void>
}

const useFetchProducts = (): FetchProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
   const [orderHistory, setOrderHistory] = useState<Booking[]>([]);
  const [loadingOrderHistory, setLoadingOrderHistory] = useState(true);
  const [errorOrderHistory, setErrorOrderHistory] = useState<Error | null>(null);


const dispatch= useStoreDispatch()
  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/products');
        const data = response.data;

        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching product data:', error);
        console.log('Response Data:', error.response?.data);
        console.log('Status Code:', error.response?.status);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterByPrice = (minPrice: number, maxPrice: number) => {
    const filtered = products.filter((product) => {
      const price = product.price;
      return price >= minPrice && price <= maxPrice;
    });
    setFilteredProducts(filtered);
  };

  const filterByLocation = (location: string) => {
    const filtered = products.filter((product) => {
      const productLocation = product.location.toLowerCase();
      return productLocation.includes(location.toLowerCase());
    });
    setFilteredProducts(filtered);
  };

  const filterByFacilities = (selectedFacilities: string[]) => {
    const filtered = products.filter((product) => {
      const productFacilities = product.facilities.map((facility) => facility.title);
      return selectedFacilities.every((facility) => productFacilities.includes(facility));
    });
    setFilteredProducts(filtered);
  };

  const updateProduct = async (productId: string, updatedProductData: any) => {
    try {
      const response = await axios.put(`http://localhost:3003/api/products/${productId}`, updatedProductData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }
  
      const updatedProducts = products.map((product) =>
        product.id === productId ? response.data : product
      );
  
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
  
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  
  

  const deleteProduct = async (productId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3003/api/products/${productId}`);

      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }

      // Remove the deleted product from the state
      setProducts((prevProducts) => prevProducts.filter((product:any) => product.id !== productId));
      setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter((product:any) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addProduct = async (newProduct: Product) => {
    try {
      const response = await axios.post('http://localhost:3003/api/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }

      const addedProduct: ProductWithImageLink = {
        ...response.data,
        imageLink: newProduct.images.length > 0 ? newProduct.images[0] : undefined,
      };

      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setFilteredProducts((prevFilteredProducts) => [...prevFilteredProducts, addedProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the token stored in localStorage to fetch user data
      const token = localStorage.getItem('userId');
      if (!token) {
        console.error('No token available in localStorage.');
        throw new Error('No token available in localStorage.');
      }

      // Set the Authorization header for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get('http://localhost:3003/api/users');

      if (!response.data) {
        console.error('No user data received in response.');
        throw new Error('No user data received in response');
      }

      dispatch({ type: 'SET_USER_DATA', payload: response.data });

      setUser(response.data);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  
    return {
      user,
      loading,
      error,
      fetchUser,
    };
  };
  



  const signup = async (user: User) => {
    try {
      const response = await axios.post('http://localhost:3003/api/signups', { auth: user });

      if (response.status === 200) {
        console.log('User registered successfully');
        setError(null);
      } else {
        console.error('Error registering user:', response.data.error);
        setError(new Error(response.data.error));
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const login = async (user: UserLogging) => {
    try {
      const response = await axios.post('http://localhost:3003/api/users', { auth: user });
  
      if (response.status === 200) {
        console.log('Login successful');
        setError(null);
  
        const token = response.data.token;
        console.log('userId:', token);
        localStorage.setItem('userId', token);
        console.log('userId added to localStorage');


        // Set the user state after a successful login
        setUser(response.data);
      } else {
        console.error('Error logging in:', response.data.error);
        setError(new Error(response.data.error));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };


  // Fetch user favorites
  // ... (previous imports)



// ... (previous interfaces)


const fetchUserFavorites = async (user: UserLogging) => {
  try {
    const response = await axios.get(`/api/users/${user.username}/favorites`);
    return response.data.favorites;
  } catch (error) {
    // Check if the error is an AxiosError with response status 404
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Handle 404: User not found or no favorites
      console.log('User not found or no favorites');
      return [];
    } else {
      // Handle other errors
      console.error('Error fetching user favorites:', error);
      throw error; // Rethrow the error for the component to handle
    }
  }
};




  // ... (Other functions above)

  const addBooking = async (productId: string, bookingData: Booking) => {
    try {
      const response = await axios.post(`http://localhost:3003/api/products/${productId}/bookings`, bookingData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }

      // Update the state with the added booking
      const updatedProducts = products.map((product: any) =>
        product.id === productId ? { ...product, booking: [...product.booking, response.data] } : product
      );

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  const deleteBooking = async (productId: string, bookingId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3003/api/products/${productId}/bookings/${bookingId}`);

      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }

      // Update the state with the booking removed
      const updatedProducts = products.map((product: any) =>
        product.id === productId
          ? { ...product, booking: product.booking.filter((booking: any) => booking._id !== bookingId) }
          : product
      );

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };


  const fetchBookingHistory = async (username: string) => {
    setLoadingOrderHistory(true);
    setErrorOrderHistory(null);

    try {
      const response = await axios.get(`http://localhost:3003/api/bookings/${username}`);

      if (!response.data) {
        console.error('No order history data received in response.');
        throw new Error('No order history data received in response');
      }

      setOrderHistory(response.data);
    } catch (error:any) {
      console.error('Error fetching order history:', error);
      setErrorOrderHistory(error);
    } finally {
      setLoadingOrderHistory(false);
    }


  return {
    // ... (Other states and functions)
    orderHistory,
    loadingOrderHistory,
    errorOrderHistory,
    fetchBookingHistory,
  };
};

// ... (other imports and interfaces)

const addToFav = async (productId: string, product: Product) => {
  try {
    const response = await fetch(`http://localhost:3003/api/products/${productId}/addToFavorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userId')}`,
      },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        images: product.images,
        
      }),
    });

    const data = await response.json();

    setUser(data.user);

  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

const deleteFromFav = async (productId: string) => {
  try {
    // Assuming you have an API endpoint to handle removing from favorites
    const response = await fetch(`/api/products/${productId}/removeFromFavorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        // Include other product information you want in removeFromFavorites
      }),
    });

    const data = await response.json();

    // Handle the response or update state accordingly
    // For example, you might want to update your local state with the updated user data
    setUser(data.user);

  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};


  // ... (other functions above)
  const deleteTicket = async (productId: string, ticketId: number) => {
    try {
      const response = await axios.delete(`http://localhost:3003/api/${productId}/booking/${ticketId}`);

      if (!response.data) {
        console.error('No data received in response.');
        throw new Error('No data received in response');
      }

      // Update the state with the ticket removed
      const updatedProducts = products.map((product:any) => {
        if (product.id === productId) {
          return {
            ...product,
            booking: product.booking.filter((ticket: any) => ticket._id !== ticketId),
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  };





  return {
    products,
    filteredProducts,
    loading,
    error,
    filterByPrice,
    filterByLocation,
    filterByFacilities,
    updateProduct,
    deleteProduct,
    addProduct,
    login,
    fetchUser,
    deleteTicket,
    signup,
    addBooking,
    deleteBooking,
    fetchBookingHistory,
    addToFav,
    fetchUserFavorites,
    deleteFromFav,
  };
};

export default useFetchProducts;
