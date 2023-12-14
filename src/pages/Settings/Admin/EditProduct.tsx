import React, { useState, useEffect } from 'react';
import useFetchProducts from '../../../Hooks/useFetchProduct';
import Authorization from './Authorize';
import SelectProduct from './SelectProduct';

function EditProduct() {
  const { products } = useFetchProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleSelectProduct = (product:any) => {
    setSelectedProductId(product);
  };

  

  const handleUpdateProduct = async (updatedProduct: any) => {
    
  };
  return (
    <div>
      <div className='w-fit text-2xl font-light m-a m-auto'>Product Management</div>
      <div className="">
        <SelectProduct products={products} onSelectProduct={handleSelectProduct} />
        {selectedProductId && (
          <Authorization
            product={products.find((product:any) => product._id === selectedProductId)}
            onUpdateProduct={handleUpdateProduct}
          />
        )}
      </div>
    </div>
  );
}

export default EditProduct;
