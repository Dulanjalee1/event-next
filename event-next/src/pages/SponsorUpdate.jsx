import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SponsorUpdate() {
  const { id } = useParams(); // Get the sponsor ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    phoneNumber: '',
    budgetRange: '',
    event: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const events = ['Tech Conference 2025', 'Annual Charity Gala', 'Startup Pitch Night', 'Community Festival'];

  useEffect(() => {
    // Fetch the current sponsor data
    const fetchSponsor = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sponsors/${id}`);
        const data = await response.json();
        setFormData(data); // Set the fetched data to the form
      } catch (error) {
        console.error('Error fetching sponsor data:', error);
      }
    };

    fetchSponsor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.organizationName) newErrors.organizationName = 'Organization Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits.';
    }
    if (!formData.budgetRange) newErrors.budgetRange = 'Budget Range is required.';
    if (!formData.event) newErrors.event = 'Event selection is required.';
    if (!formData.message) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch(`http://localhost:3000/api/sponsors/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccessMessage('Sponsor updated successfully!');
          setTimeout(() => navigate('/my-sponsor-list'), 2000); // Redirect to the sponsor list after 2 seconds
        } else {
          console.error('Failed to update sponsor');
        }
      } catch (error) {
        console.error('Error updating sponsor:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Update Sponsor</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-400 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Name */}
        <div>
          <label htmlFor="organizationName" className="block text-gray-700 font-medium">
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your organization name"
          />
          {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor="budgetRange" className="block text-gray-700 font-medium">
            Budget Range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              Select your budget range
            </option>
            <option value="<500">Less than $500</option>
            <option value="500-1000">$500–$1000</option>
            <option value=">1000">More than $1000</option>
          </select>
          {errors.budgetRange && <p className="text-red-500 text-sm">{errors.budgetRange}</p>}
        </div>

        {/* Event Dropdown */}
        <div>
          <label htmlFor="event" className="block text-gray-700 font-medium">
            Select Event
          </label>
          <select
            id="event"
            name="event"
            value={formData.event}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              Select an event to sponsor
            </option>
            {events.map((event, index) => (
              <option key={index} value={event}>
                {event}
              </option>
            ))}
          </select>
          {errors.event && <p className="text-red-500 text-sm">{errors.event}</p>}
        </div>

        {/* Message / Intent */}
        <div>
          <label htmlFor="message" className="block text-gray-700 font-medium">
            Message / Intent
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Write your message or intent here"
            rows="4"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default SponsorUpdate;