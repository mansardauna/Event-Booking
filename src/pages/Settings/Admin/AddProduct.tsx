import axios from 'axios';
import { ObjectId } from 'mongoose';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Button from '../../../components/UI/Button';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import MapModal from './MapModal';

interface Facility {
  icon: string;
  title: string;
  [key: string]: string; // Add an index signature
}

interface NewProduct {
  id: ObjectId | any;
  name: string;
  price: number;
  rate: string;
  images: any[];
  videos: any[];
  location: string;
  category: string;
  des: string;
  facilities: Facility[];
  booking: any[];
  reviews: any[];
  passcode: string
}

const AddProductForm: React.FC = () => {
  const { products, addProduct } = useFetchProducts();

  const [newProduct, setNewProduct] = useState<NewProduct>({
    id:'',
    name: '',
    price: 0,
    rate: '0',
    images: [],
    videos: [],
    location: '',
    category: 'Near me',
    des: '',
    facilities: [],
    booking: [],
    reviews: [],
    passcode: ''
  });

  const [isShowLocation, setIsLocation] = useState(false);
  const [images, setImages] = useState<File | null>(null);
  const [videos, setVideos] = useState<File | null>(null);

  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImages(selectedImage);
    }
  };
  

  const handleUploadImage = async () => {
    if (!images) {
      console.error('No image selected');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('images', images);
  
      const response = await axios.post('http://localhost:3003/api/upload', formData);
  
      // Log the response for debugging
      console.log('Upload response:', response);
  
      if (response.status !== 200) {
        console.error('Failed to upload image');
        return;
      }
  
      const { filePath } = response.data;
  
      setNewProduct({
        ...newProduct,
        images: [filePath],
      });
  
      console.log('Image uploaded successfully. Image path:', filePath);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  

  const handlePasscodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewProduct({
      ...newProduct,
      passcode: value,
    });
  };

  const handleLocation = () => {
    setIsLocation(!isShowLocation);
  };

  const handleSelectedLocation = (selectedLocation: string) => {
    setNewProduct({
      ...newProduct,
      location: selectedLocation,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selecteVideo = e.target.files[0];
      setVideos(selecteVideo);
    }
  
    }
  
  const handleVideoUploadButton = async () => {
    if (!videos) {
      console.error('No video selected');
      return;
    }
         try {
        const formData = new FormData();
        formData.append('videos', videos);

        const response = await axios.post('http://localhost:3003/api/upload', formData);

        if (response.status !== 200) {
          console.error('Failed to upload video');
          return;
        }

        const { filePath } = response.data;

        setNewProduct({
          ...newProduct,
          videos: [filePath],
        });

        console.log('Video uploaded successfully. Video path:', filePath);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  ;

  const facilities: Facility[] = [
    { icon: 'icon1', title: 'Swimming pool' },
    { icon: 'icon2', title: 'Restaurant' },
    { icon: 'icon3', title: 'Free Wifi' },
    { icon: 'icon4', title: 'Free Parking' },
    { icon: 'icon5', title: 'Gym'},
    { icon: 'icon6', title: '24/7 Security' },
    { icon: 'icon7', title: 'Sound System' },
    { icon: 'icon3', title: 'Decoration' },
    { icon: 'icon8', title: 'Full A/C' },
    { icon: 'icon9', title: 'Catering Service' },
    { icon: 'icon10', title: 'Rooms' },
  ];

  const [selectedFacility, setSelectedFacility] = useState<Facility>({
    icon: '',
    title: '',
  });

  const handleAddFacility = () => {
    setNewProduct({
      ...newProduct,
      facilities: [...newProduct.facilities, selectedFacility],
    });

    // Reset the selected facility
    setSelectedFacility({
      icon: '',
      title: '',
    });
  };

  const handleFacilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedFacilityTitle = e.target.value;

    // Find the selected facility by title
    const selectedFacility = facilities.find(
      (facility) => facility.title === selectedFacilityTitle
    );

    if (selectedFacility) {
      setSelectedFacility(selectedFacility);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewProduct({
      ...newProduct,
      category: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await addProduct(newProduct);

      setNewProduct({
        id: '',
        name: '',
        price: 0,
        rate: '0',
        images: [],
        videos: [],
        location: '',
        category: 'Near me',
        des: '',
        facilities: [],
        booking: [],
        reviews: [],
        passcode: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleImageUploadButton = () => {
    // Trigger the hidden file input
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <div className="p-2 md:w-9/12 m-auto items-center flex flex-col gap-3 border mt-2">
      <div className="w-fit m-auto p-2 text-3xl font-light">Add New Event Hall</div>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="flex gap-3 items-center">
          <label className="w-20 text-center">Name</label>
          <input type="text" name="name" value={newProduct.name} onChange={handleChange} className="p-2 border rounded-md" />
        </div>
        <div className="flex gap-3 items-center">
          <label className="w-20 text-center">Price</label>
          <input type="number" name="price" value={newProduct.price} onChange={handleChange} className="p-2 w-28 border rounded-md" />
          <div className="flex gap-3 items-center">
          <label className="w-20 text-center">Rate</label>
          <input type="text" name="rate" value={newProduct.rate} onChange={handleChange} className="p-2 w-28 border rounded-md" />
        </div>

        </div>
        <div className="flex gap-3 items-center">
          <label className="w-20 text-center">Location</label>
          <Button onClick={handleLocation} variant="primary">
            Select
          </Button>
          {isShowLocation && <MapModal onLocationSelect={handleSelectedLocation} />}
          {newProduct.location && (
            <span className="text-green-500 ">{newProduct.location}</span>
          )}
        </div>
      </div>
      <div className="md:flex justify-between gap-2 w-full">
        <div className="gap-2 items-center">
         
          <input
            type="file"
            name="images"
            ref={imageInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleImageUpload}
          />
          {/* Upload button */}
          <Button onClick={handleImageUploadButton} variant='secondary'>
            Select Image
          </Button>
          <Button variant='primary' onClick={handleUploadImage}>
            Upload Image
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <label>Videos</label>
          <input type="file" name="videos" multiple onChange={handleVideoUpload} className="border p-2" />
        <Button onClick={() => handleVideoUploadButton} variant="primary">
            Upload Video
          </Button>
          </div>

      </div>
      <div className="flex gap-2 items-center">
        <label>Category</label>
        <select name="category" value={newProduct.category} onChange={handleCategoryChange} className="p-2">
          <option value="multipurpose ">multipurpose</option>
          <option value="Open-space">Open Space</option>
          <option value="rated">Rated</option>
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label>Description:</label>
        <textarea name="des" value={newProduct.des} onChange={handleChange} className="border rounded-md" />
      </div>
      <div className="flex gap-2 items-center">
        <label>Facilities:</label>
        <select
            name="facility"
            value={selectedFacility.title}
            onChange={handleFacilityChange}
            className="p-2"
          >
            <option value="" disabled>
              Select Facility
            </option>
            {facilities.map((facility) => (
              <option key={facility.title} value={facility.title}>
                {facility.title}
              </option>
            ))}
          </select>
        <Button variant="secondary" onClick={handleAddFacility} className="p-2">
          Add Facility
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <label className="w-20 text-center">Passcode</label>
        <input
          type="text"
          name="passcode"
          value={newProduct.passcode}
          onChange={handlePasscodeChange}
          className="p-2 border rounded-md"
        />
      </div>

      <Button variant="primary" onClick={handleSubmit} className="m-auto w-fit hover:text-white">
        Add Product
      </Button>
    </div>
  );
};

export default AddProductForm;
