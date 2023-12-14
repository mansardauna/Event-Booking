import React, { useState } from "react";
import FavoriteList from "./components/FavouriteList";
import { ActionTypes, useStore, useStoreDispatch } from "../../store/AuthProvider";

function FavPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const storeDispatch = useStoreDispatch();

  // Define the function to remove an item from the watchlist
  const removeFromWatchlist = (itemId: any) => {
    // Dispatch an action to remove the item from the watchlist
    storeDispatch({ type: ActionTypes.REMOVE_FROM_WATCHLIST, payload: itemId });
  };

  return (
    <div>
      <div className="w-fit m-auto font-extralight p-2 mt-3 text-2xl">My Favorite List</div>
      <FavoriteList onRemoveFromWatchlist={(itemId:any) => removeFromWatchlist(itemId)} favourites={favorites} />
    </div>
  );
}

export default FavPage;