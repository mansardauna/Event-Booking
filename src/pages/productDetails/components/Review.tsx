// Import statements (ensure you have the correct imports for your components and icons)

import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '../../../components/UI/Button';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import UserAvatar from './UserAvatar';
import { BackSquare, Send } from 'iconsax-react';

interface ReviewProps {
  username: string;
  rating: number;
  comment: string;
}

interface Facility {
  icon: string;
  title: string;
}

interface Product {
  id: string;
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
  reviews: ReviewProps[];
}

interface UserReviewProps {
  product: Product;
  productId: number;
}

const Review: React.FC<UserReviewProps> = ({ product, productId }) => {
  const { fetchUser } = useFetchProducts();
  const [review, setReview] = useState<ReviewProps>({
    username: '', // Initialize with an empty string
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        // Fetch the username from localStorage
        const storedToken = localStorage.getItem('authToken');

        // Fetch user details using the stored token
        if (storedToken) {
          const userLogin = await fetchUser(storedToken);
          setReview((prevReview) => ({
            ...prevReview,
            username: userLogin.user?.username || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching login information:', error);
      }
    };

    fetchLogin();
  }, [fetchUser]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const { updateProduct } = useFetchProducts();

  const submitReview = async () => {
    try {
      const updatedProduct: Product = { ...product };
      updatedProduct.reviews.push(review);

      await updateProduct(productId.toString(), updatedProduct);

      alert('Review submitted successfully!');
      setReview({
        username: '', // Reset username to an empty string after submission
        rating: 0,
        comment: '',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Review submission failed.');
    }
  };

  const deleteReview = (index: any) => {
    const updatedProduct: Product = { ...product };
    updatedProduct.reviews.splice(index, 1);

    updateProduct(productId.toString(), updatedProduct)
      .then(() => {
        alert('Review deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
        alert('Review deletion failed.');
      });
  };

  const handleRatingChange = (newRating: number) => {
    setReview({ ...review, rating: newRating });
  };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= count ? 'text-yellow-500' : 'text-black'}
          onClick={() => handleRatingChange(i)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="w-full rounded-md p-3 mt-4">
      {product.reviews.length > 0 && (
        <div>
          <div className='w-7/12 md:w-4/12 m-auto bg-slate-400 text-xl text-center text-white p-1 rounded-md'>Reviews</div>
          <div>
            {product.reviews.map((r, index) => (
              <div className='flex flex-col gap-3 border-b border-slate-200 p-2' key={index}>
                <div className="flex items-center gap-1">
                  <UserAvatar username={r.username} />
                  <div className="capitalize">{r.username}</div>
                  <BackSquare className='cursor-pointer hover:bg-slate-400 rounded-xl' onClick={() => deleteReview(index)}/>
                </div>
                <div className="flex gap-3 items-center">
                  <div className='bg-slate-200 rounded-md p-2 w-fit max-w-xl'>{r.comment}</div>
                  <div>
                    {renderStars(r.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 mt-4 border-slate-500 rounded-lg border">
        <div className="flex p-2 gap-4 m-auto items-center cursor-pointer">
          <label htmlFor="rating">Rate Us</label>
          {renderStars(review.rating)}
        </div>
        <div className="flex p-2 gap-4 items-center">
          <label htmlFor="comment">Review</label>
          <textarea
            name="comment"
            rows={2}
            value={review.comment}
            onChange={handleInputChange}
            className="p-2 m-auto w-1/2 border"
          />
          <Button variant="primary" onClick={submitReview} className="rounded-md text-white">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Review;
