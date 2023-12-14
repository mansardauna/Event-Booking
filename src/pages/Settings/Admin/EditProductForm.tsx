import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '../../../components/UI/Button';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import UserTicket from './UserTicket';
import MapModal from './MapModal'; // Import MapModal component
import axios from 'axios';


interface Facility {
  icon: string;
  title: string;
}

interface Review {
  username: string;
  rating: number;
  comment: string;
}

interface Product {
  _id: string;
  images: any[];
  name: string;
  price: number;
  videos: any[];
  location: string;
  facilities: Facility[];
  rate: string;
  des: string;
  category: string;
  booking: any[];
  reviews: Review[];
}

interface EditProductFormProps {
  product: Product;
  onUpdateProduct: any;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onUpdateProduct,
}) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const { updateProduct, deleteProduct } = useFetchProducts();
  const [toggle, setToggle] = useState(false);
  const [isShowLocation, setIsShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]); // State to track new images
  const [newVideos, setNewVideos] = useState<File[]>([]); // State to track new videos


  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imagesArray = Array.from(files);
      setNewImages(imagesArray);
    }
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const videosArray = Array.from(files);
      setNewVideos(videosArray);
    }
  };

  const handleImageDelete = (index: number) => {
    const updatedImages = [...editedProduct.images];
    updatedImages.splice(index, 1);
    setEditedProduct({ ...editedProduct, images: updatedImages });
  };

  const handleImageUploadButton = async () => {
    if (newImages.length === 0) {
      console.error('No images selected');
      return;
    }

    try {
      const formData = new FormData();
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post('http://localhost:3003/api/upload', formData);

      if (response.status !== 200) {
        console.error('Failed to upload images');
        return;
      }

      const { filePaths } = response.data;

      setEditedProduct({
        ...editedProduct,
        images: [...editedProduct.images, ...filePaths],
      });

      setNewImages([]); // Clear the newImages state after adding to the array

      console.log('Images uploaded successfully. Image paths:', filePaths);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedProduct = { ...editedProduct };

      if (selectedLocation && selectedLocation !== editedProduct.location) {
        updatedProduct.location = selectedLocation;
      }

      // Handle updating images and videos here if needed

      setEditedProduct(updatedProduct);

      const response = await updateProduct(product._id, updatedProduct);

      console.log('Updated Product:', response);
      onUpdateProduct(response);
    } catch (error) {
      console.error('Error updating product:', error);
      onUpdateProduct(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(editedProduct._id);
      onUpdateProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleLocationSelection = (location: string) => {
    // Update the selectedLocation and the editedProduct.location
    setSelectedLocation(location);
    setEditedProduct((prevEditedProduct) => ({
      ...prevEditedProduct,
      location: location,
    }));
    setIsShowLocation(false);
  };

  return (
    <div className='flex flex-col md:block w-fit m-auto'>
      <Button
        variant="primary"
        onClick={handleToggle}
        className="w-fit bg-slate-200 m-auto rounded-md float-right mr-2 hover:bg-slate-400"
      >
        {toggle ? 'Cancel Edit' : 'Edit hall Details'}
      </Button>
      <div className="flex flex-col gap-3 p-2 md:p-3 md:flex-row">
        <div className="flex flex-col">
          <img
            src={editedProduct.images[0]}
            alt={editedProduct.name}
            className="w-80 h-60 m-auto rounded-md"
          />
          <div className="p-2 w-11/12 shadow-md text m-auto text-center capitalize rounded-lg">
            <div className="text-red-400">
              {editedProduct.booking.length}
            </div>
            <div className=""> user booked your hall</div>
          </div>
        </div>
        <div className="md:w-7/12">
          {toggle ? (
            <div className="flex flex-col gap-4">
              <div className="w-fit m-auto text-2xl font-light">Edit Product</div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label className="w-20">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    className="border p-2 rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleChange}
                    className="border p-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label className="w-20">Rate</label>
                  <input
                    type="text"
                    name="rate"
                    value={editedProduct.rate}
                    onChange={handleChange}
                    className="border p-2 rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20">Location</label>
                  <Button className='bg- bg-slate-400 border-none rounded-md hover:text-white'
                    onClick={() => setIsShowLocation(true)}
                    variant="primary"
                  >
                    Select
                  </Button>
                  <div className="">
                  {isShowLocation && (
        <MapModal onLocationSelect={handleLocationSelection} />
      )}
                  </div>
                  {selectedLocation && (
                    <span className=" w-40 p-2 border text-center rounded-md text-green-500">
                      {selectedLocation}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-20">Category</label>
                <select
                  name="category"
                  value={editedProduct.category}
                  onChange={handleSelectChange}
                  className="border p-2 rounded-md"
                >
                  <option value=" multipurpose">Multipurpose</option>
                  <option value="Open-space">Open Space</option>
                  <option value="rated">Reated</option>
                </select>
              </div>
              <div className="flex items-center gap-2 md:w-11/12">
                <label className="w-20">Description</label>
                <textarea
                  name="des"
                  value={editedProduct.des}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full h-20"
                />
                
              </div>
              <>
              <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border p-2 rounded-md mt-2"
          />
          <Button onClick={handleImageUploadButton} variant="primary">
            Upload Images
          </Button>
          {newImages.length > 0 && (
            <div className="mt-2">
              <p>New Images:</p>
              <ul>
                {newImages.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
           <div className="mt-2">
            <p>Existing Images:</p>
            <ul>
              {editedProduct.images.map((image, index) => (
                <li key={index}>
                  {image}
                  <button onClick={() => handleImageDelete(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div></>
              <Button
                variant="primary"
                onClick={handleUpdate}
                className="w-fit text-white m-auto rounded-md"
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={handleDelete}
                className="w-fit bg-slate-200 m-auto rounded-md"
              >
                Delete
              </Button>
            </div>
          ) : (
            <UserTicket
              booking={editedProduct.booking}
              productId={product._id}
              product={product}
            />
          )}
        </div>
      </div>
      
    </div>
  );
};

export default EditProductForm;