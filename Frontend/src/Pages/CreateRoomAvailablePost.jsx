import React, { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, User, Home, Phone, Mail, MessageCircle, Upload, X, Check, Camera, Star } from 'lucide-react';

const CreateRoomAvailablePost = () => {
  const [formData, setFormData] = useState({
    type: 'room_available',
    title: '',
    description: '',
    rent: '',
    location: {
      area: '',
      city: 'Jaipur',
      nearbyCollege: '',
      fullAddress: ''
    },
    preferences: {
      gender: '',
      ageRange: { min: '', max: '' },
      occupation: '',
      habits: [],
      cleanliness: ''
    },
    roomDetails: {
      roomType: '',
      furnishing: '',
      amenities: []
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
      preferredContact: []
    },
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  const collegeOptions = [
    'Manipal University Jaipur',
    'University of Rajasthan',
    'MNIT Jaipur',
    'IIT Jodhpur',
    'Jaipur National University',
    'Amity University Jaipur',
    'Other'
  ];

  const habitOptions = [
    'non_smoker', 'vegetarian', 'early_riser', 'night_owl', 
    'fitness_enthusiast', 'music_lover', 'pet_friendly'
  ];

  const amenityOptions = [
    'wifi', 'ac', 'parking', 'washing_machine', 'refrigerator',
    'kitchen', 'balcony', 'security', 'elevator', 'power_backup'
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(value)
          ? prev[section][field].filter(item => item !== value)
          : [...prev[section][field], value]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreview.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Valid rent amount is required';
    if (!formData.location.area.trim()) newErrors.area = 'Area is required';
    if (!formData.location.nearbyCollege) newErrors.college = 'Nearby college is required';
    if (!formData.preferences.gender) newErrors.gender = 'Gender preference is required';
    if (!formData.roomDetails.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.roomDetails.furnishing) newErrors.furnishing = 'Furnishing status is required';
    if (!formData.contact.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.contact.preferredContact.length === 0) newErrors.contact = 'Select at least one contact method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Here you would make the API call to your backend
      console.log('Submitting room available post:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect back to roommate finder
      window.location.href = '/roommatefinder';
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Room Available</h1>
          </div>
          <p className="text-emerald-100">List your available room and find the perfect tenant</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2 text-emerald-500" />
              Room Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                  placeholder="e.g., Spacious single room in 2BHK near MUJ"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                  placeholder="Describe your room, the flat, nearby amenities, house rules, and what kind of tenant you're looking for..."
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => handleInputChange(null, 'rent', e.target.value)}
                    placeholder="15000"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.rent ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent}</p>}
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-700">Pro Tip</span>
                  </div>
                  <p className="text-sm text-emerald-600">
                    Competitive pricing attracts more genuine tenants. Check similar rooms in your area.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Locality *
                </label>
                <input
                  type="text"
                  value={formData.location.area}
                  onChange={(e) => handleInputChange('location', 'area', e.target.value)}
                  placeholder="e.g., Vaishali Nagar, Malviya Nagar"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nearby College/University *
                </label>
                <select
                  value={formData.location.nearbyCollege}
                  onChange={(e) => handleInputChange('location', 'nearbyCollege', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.college ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select nearby college</option>
                  {collegeOptions.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
                {errors.college && <p className="text-red-500 text-sm mt-1">{errors.college}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <textarea
                  value={formData.location.fullAddress}
                  onChange={(e) => handleInputChange('location', 'fullAddress', e.target.value)}
                  placeholder="Full address with landmarks for better visibility"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Room Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-500" />
              Room Specifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  value={formData.roomDetails.roomType}
                  onChange={(e) => handleInputChange('roomDetails', 'roomType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.roomType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select room type</option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3 BHK</option>
                </select>
                {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnishing Status *
                </label>
                <select
                  value={formData.roomDetails.furnishing}
                  onChange={(e) => handleInputChange('roomDetails', 'furnishing', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.furnishing ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
                {errors.furnishing && <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.roomDetails.amenities.includes(amenity)}
                      onChange={() => handleArrayToggle('roomDetails', 'amenities', amenity)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tenant Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              Tenant Preferences
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Gender *
                  </label>
                  <select
                    value={formData.preferences.gender}
                    onChange={(e) => handleInputChange('preferences', 'gender', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select preference</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                    <option value="any">No Preference</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range (Min)
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.ageRange.min}
                    onChange={(e) => handleInputChange('preferences', 'ageRange', {...formData.preferences.ageRange, min: e.target.value})}
                    placeholder="18"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range (Max)
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.ageRange.max}
                    onChange={(e) => handleInputChange('preferences', 'ageRange', {...formData.preferences.ageRange, max: e.target.value})}
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Occupation
                  </label>
                  <select
                    value={formData.preferences.occupation}
                    onChange={(e) => handleInputChange('preferences', 'occupation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">No Preference</option>
                    <option value="student">Students Only</option>
                    <option value="working_professional">Working Professionals Only</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanliness Expectation
                  </label>
                  <select
                    value={formData.preferences.cleanliness}
                    onChange={(e) => handleInputChange('preferences', 'cleanliness', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">No Preference</option>
                    <option value="very_clean">Very Clean</option>
                    <option value="moderately_clean">Moderately Clean</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Tenant Habits
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {habitOptions.map(habit => (
                    <label key={habit} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.preferences.habits.includes(habit)}
                        onChange={() => handleArrayToggle('preferences', 'habits', habit)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {habit.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Room Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-pink-500" />
              Room Images
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">Click to upload room images</p>
                  <p className="text-sm text-gray-500">Maximum 5 images, PNG, JPG up to 5MB each</p>
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-500" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How should tenants contact you? *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'phone', label: 'Phone Call', icon: Phone },
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
                  ].map(method => (
                    <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.contact.preferredContact.includes(method.value)}
                        onChange={() => handleArrayToggle('contact', 'preferredContact', method.value)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <method.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing Room...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Publish Room
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomAvailablePost;