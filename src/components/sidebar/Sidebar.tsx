import { CloseSquare, HambergerMenu, Moon, Sun1 } from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';
import ProductSearch from '../../pages/Home/components/Nav/Search';
import { NavList, Rate } from '../ItemMap.tsx/NavList';
interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  images: any
  // Add other product properties here
}
interface SidebarProps {
  // isDarkMode: boolean;
  toggleDarkMode: () => void;
  products: Product[]; // Pass the product data to the Nav component
  logout: ()=> void;

}

const Sidebar: React.FC<SidebarProps> = ({  toggleDarkMode, products, logout }) => {
  return (
    <>
      <div className={`md:flex flex-col 
      gap-5 hidden  bg-opacity-80 h-screen p-2 pr-0 relative justify-between pb-20 text-white `}>
        <div className="mx-auto my-2 logo md:text-2xl text-xl font-semibold">Event Hall</div>
        <ProductSearch products={products}/>
        <div className='mt-2'>
          {NavList.map((item) => (
            <Link to={item.link} key={item.id}>
              <div className='flex cursor-pointer p-3 items-center text-sm md:text-xl hover:text-gray-300 hover-border-r-4 border-white gap-3'>
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className='w-10/12 border-t m-auto mb-0 border-white pt-5'>
          {Rate.map((item) => (
            <Link to={item.link} key={item.id}>
              <div className='flex cursor-pointer items-center p-3 text-sm font-light hover-text-gray-300 gap-3'>
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <div>
          <div className="flex justify-between p-4 ">
            <div className="p-2 flex shadow-md cursor-pointer rounded-md gap-2 items-center">
              <Sun1 size={20} onClick={toggleDarkMode} />
            </div>
            <div className="p-2 flex shadow-md cursor-pointer rounded-md gap-2 items-center">
              <Moon size={20} onClick={toggleDarkMode} />
            </div>
          </div>
        </div>
        <Link to="/signin">
          <div className=' font-bold w-fit m-auto' onClick={logout}>Log out</div>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
