import { Heart, HeartSlash } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { useStore, useStoreDispatch } from "../../../store/AuthProvider";
import DetailButton from "./DetailButton";

interface Product {
  _id: number;
  img: string;
  name: string;
  price: number;
  quantity: number;
  calculatedPrice: number;
}

interface FavoriteListProps {
  onRemoveFromWatchlist: any;
  favourites: Product[]; // Add the watchlistItems prop
}

const FavoriteList: React.FC<FavoriteListProps> = ({ onRemoveFromWatchlist, favourites }) => {

  const removeFromWatchlist = (itemId: number) => {
    
      onRemoveFromWatchlist(itemId);
    
  };

  if (favourites.length === 0) {
    return <div>No favorite items to display.</div>;
  }

  return (
    <div className="w-11/12 p-2 m-auto">
      <div className="grid md:grid-cols-2 gap-3">
        {favourites.map((item: any) => (
          <div key={item._id} className="p-2 border rounded-lg bg-slate-50 flex gap-5">
            <div>
              <img src={item.images[0]} alt={item.name} className='md:w-60 h-40 w-80 rounded-lg' />
            </div>
            <div className="flex flex-col gap-3 h-fit w-full m-auto">
              <div className="flex items-center cursor-pointer w-11/12 justify-between gap-5">
                <div className="md:text-2xl font-light text-lg m-fit">{item.name}</div>
                <HeartSlash onClick={() => removeFromWatchlist(item._id)} />
              </div>
              <div className="text-gray-400">{item.location}</div>
              <div className=" font-semibold">NGN{item.price} /Day</div>
              <DetailButton watchlistItems={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteList;
