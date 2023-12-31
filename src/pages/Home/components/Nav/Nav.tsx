import React, { useEffect, useState } from 'react';
import CurrentLocation from './CurrentLocation';
import Favourites from './NavFavourites';
import Language from './Language';
import NavNotifty from './NavNotifty';
import ProductSearch from './Search';
import UserAvatar from '../../../productDetails/components/UserAvatar';
import useFetchProducts from '../../../../Hooks/useFetchProduct';

interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  images: any;
  // Add other product properties here
}

interface NavProps {
  isDark: boolean;
  products: Product[]; // Pass the product data to the Nav component
}

const Nav: React.FC<NavProps> = ({ isDark, products }) => {
  const [username, setUsername] = useState('User');
  const { fetchUser } = useFetchProducts();

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        // Fetch the username from localStorage
        const storedToken = localStorage.getItem('authToken');

        // Fetch user details using the stored token
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

  return (
    <div className={`border-b pb-3 md:ml-[10%] bg-white  fixed md:w-full w-full shadow-md md:shadow-none z-20 p-2 ${isDark ? 'nav' : ''}`}>
      <div className='md:hidden flex mt-14 w-10/12 items-center gap-2 m-auto'>
        <ProductSearch products={products} />
      </div>

      <div className={`relative m-auto w-full hidden items-center justify-center gap-2 md:mt-0 mt-2 md:gap-5 p-2 md:p-1 cursor-pointer md:flex z-50`}>
        <CurrentLocation />
        <Language />
        <Favourites />
        <NavNotifty />
        <UserAvatar username={username} />
      </div>
    </div>
  );
};

export default Nav;
