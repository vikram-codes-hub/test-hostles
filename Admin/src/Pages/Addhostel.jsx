import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Title from '../Components/Title';

const Addhostel = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    price: '',
    category: 'Boys',
    listedDate: '',
    owner: '',
    description: '',
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [preview, setPreview] = useState([null, null, null, null]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...images];
    const updatedPreview = [...preview];

    updatedImages[index] = file;
    updatedPreview[index] = URL.createObjectURL(file);

    setImages(updatedImages);
    setPreview(updatedPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.some(img => img === null)) {
      toast.error('Please upload all 4 images');
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key]);
    });

    images.forEach((img, i) => {
      payload.append('images', img); // Assuming backend expects 'images' as array
    });

    try {
      const res = await axios.post('/api/hostels/add', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Hostel added successfully!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          price: '',
          category: 'Boys',
          listedDate: '',
          owner: '',
          description: '',
        });
        setImages([null, null, null, null]);
        setPreview([null, null, null, null]);
      } else {
        toast.error(res.data.mssg || 'Error adding hostel');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add hostel');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-4xl mx-auto p-6 gap-6 bg-white shadow-md rounded-lg"
    >
     <div className='text-2xl'>
        <Title  text1={"Add"} text2={"Hostel"}/>

    </div>
      {/* Text inputs */}
      <input type="text" name="name" placeholder="Hostel Name" value={formData.name} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <select name="category" value={formData.category} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800">
        <option value="Boys">Boys</option>
        <option value="Girls">Girls</option>
      </select>
      <input type="date" name="listedDate" value={formData.listedDate} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <input type="text" name="owner" placeholder="Owner Name" value={formData.owner} onChange={handleChange} className="p-3 rounded border bg-gray-100 text-gray-800" required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows="4" className="p-3 rounded border bg-gray-100 text-gray-800" required></textarea>

      {/* Image Upload Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="text-gray-700">Upload Image {index + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
              className="p-2 bg-gray-100 border rounded"
              required
            />
            {preview[index] && (
              <img src={preview[index]} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="bg-black hover:scale-103 transition-all duration-400 text-white font-semibold py-2 px-6 rounded mt-4">
        Submit Hostel
      </button>
    </form>
  );
};

export default Addhostel;
