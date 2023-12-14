import React, { useState, useEffect } from 'react';
import Product from '../../../components/Product/Product';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import { ObjectId } from 'mongoose';

interface Facility {
  icon: string;
  title: string;
}

interface ProductItem {
  id: ObjectId | any;
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
  reviews: any[];
}

function Header() {
  const [showDetail, setShowDetail] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Near By');
  const { products, loading, error } = useFetchProducts();
  const [userLocation, setUserLocation] = useState<string | null>(null); // Assuming user location is a string

  useEffect(() => {
    const uniqueCategories = Array.from<string>(new Set(products.map((product: any) => product.category)));
    setCategories(['Near By', ...uniqueCategories]); // Include 'Near By' category option
  }, [products]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationName = await fetchLocationName(latitude, longitude);
            setUserLocation(locationName);
          } catch (error) {
            console.error('Error fetching user location name:', error);
          }
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    }
  }, []);

  const fetchLocationName = async (latitude: number, longitude: number) => {
    const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    const response = await fetch(nominatimApiUrl);
    const data = await response.json();
    return data.display_name || 'Unknown';
  };

  const filterProducts = () => {
    if (activeCategory === 'Near By' && userLocation) {
      return products.filter((product: ProductItem) => isLocationNameNearUser(product.location, userLocation));
    } else if (activeCategory === 'multipurpose' && userLocation) {
      return products
        .filter((product: ProductItem) => product.category === 'multipurpose')
        .filter((product: ProductItem) => isLocationNameNearUser(product.location, userLocation));
    } else if (activeCategory === 'Rated') {
      return products.filter((product: ProductItem) => parseFloat(product.rate) > 3.5);
    } else {
      return products.filter((product: ProductItem) => product.category === activeCategory);
    }
  };

  const isLocationNameNearUser = (productLocation: string, userLocation: string) => {
  
    return Math.abs(productLocation.length - userLocation.length) <= 10;
  };

  const filteredProducts = filterProducts();

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between md:w-6/12 w-10/12 m-auto md:p-4 mt-2 md:mt-0 cursor-pointer text-lg text-slate-400">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`pb-1 cursor-pointer ${activeCategory === category ? 'border-b text-slate-500 border-red-300' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <div className="flex">
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 md:w-11/12 w-10/12 p-2 m-auto">
            {window.innerWidth <= 768 ? (
              <Slider {...sliderSettings} className="single-product-slider">
                {filteredProducts.map((product: ProductItem) => (
                  <Product key={product.id} productInfo={product} show={showDetail} />
                ))}
              </Slider>
            ) : (
              filteredProducts.map((product: ProductItem) => (
                <Product key={product.id} productInfo={product} show={showDetail} />
              ))
            )}
          </div>
        ) : (
          <div>No products available in the selected category.</div>
        )}
        <div>{/* Add other content here */}</div>
      </div>
    </div>
  );
}

export default Header;
