import { useState } from 'react';
import { Calendar, Clock, MapPin, Car, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface BookingFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  pickupLocation: string;
  destination: string;
  carType: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  passengers: string;
  specialRequests: string;
}

const initialFormData: BookingFormData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  pickupLocation: '',
  destination: '',
  carType: '',
  serviceType: '',
  pickupDate: '',
  pickupTime: '',
  passengers: '1',
  specialRequests: '',
};

const pickupLocations = [
  'Lagos Airport (LOS)',
  'Abuja Airport (ABV)',
  'Victoria Island',
  'Ikeja',
  'Lekki',
  'Ikoyi',
  'Abuja City Center',
  'Wuse',
  'Garki',
  'Other Location',
];

const carTypes = [
  'Saloon Car',
  'SUV',
  'Luxury Sedan',
  'Hiace Bus (14 seats)',
  'Coaster Bus (32 seats)',
];

const serviceTypes = [
  'Airport Transfer',
  'Business Meeting',
  'Event Transportation',
  'City Tour',
  'Wedding Transport',
  'Shopping Trip',
  'Other',
];

const passengerOptions = ['1', '2', '3', '4', '5–8', '9–14', '15+'];

interface BookingFormProps {
  preselectedCarType?: string;
}

export default function BookingForm({ preselectedCarType }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    ...initialFormData,
    carType: preselectedCarType || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.fullName.trim()) errors.push('Full Name is required');
    if (!formData.phoneNumber.trim()) errors.push('Phone Number is required');
    if (!formData.email.trim()) errors.push('Email Address is required');
    if (!formData.pickupLocation) errors.push('Pickup Location is required');
    if (!formData.carType) errors.push('Car Type is required');
    if (!formData.pickupDate) errors.push('Pickup Date is required');
    if (!formData.pickupTime) errors.push('Pickup Time is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Fire-and-forget: send booking to admin via edge function (don't await result)
    const { supabase } = await import("@/integrations/supabase/client");
    supabase.functions.invoke('send-booking-notification', {
      body: {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phoneNumber,
        pickupLocation: formData.pickupLocation,
        destination: formData.destination,
        carType: formData.carType,
        serviceType: formData.serviceType,
        date: formData.pickupDate,
        time: formData.pickupTime,
        passengers: formData.passengers,
        specialRequests: formData.specialRequests,
      }
    }).catch((err) => console.error("Notification error:", err));

    // Always show success screen immediately
    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after 10 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData(initialFormData);
    }, 10000);
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-elegant p-8 text-center">
        <div className="w-16 h-16 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="h-8 w-8 text-success-green" />
        </div>
        <h3 className="text-2xl font-bold text-luxury-navy mb-4">
          Booking Confirmed!
        </h3>
        <div className="bg-luxury-cream rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-luxury-navy mb-3">Booking Details:</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Phone:</strong> {formData.phoneNumber}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Pickup:</strong> {formData.pickupLocation}</p>
            {formData.destination && <p><strong>Destination:</strong> {formData.destination}</p>}
            <p><strong>Car Type:</strong> {formData.carType}</p>
            <p><strong>Date:</strong> {formData.pickupDate} at {formData.pickupTime}</p>
            <p><strong>Passengers:</strong> {formData.passengers}</p>
            {formData.specialRequests && <p><strong>Special Requests:</strong> {formData.specialRequests}</p>}
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Your booking request has been received! Kindly message us on WhatsApp with your booking details to confirm your booking. Thank you!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/2348026149390"
            className="whatsapp-btn justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="h-5 w-5" />
            WhatsApp Us
          </a>
          <a
            href="tel:+2348026149390"
            className="btn-outline flex items-center justify-center gap-2"
          >
            Call Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-elegant p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-luxury-navy mb-2">
          Book Your Ride
        </h2>
        <p className="text-gray-600">
          Fill out the form below and we'll get back to you immediately
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="form-select pl-12"
                required
              >
                <option value="">Select pickup location</option>
                {pickupLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter destination (optional)"
            />
          </div>

          {/* Car Type */}
          <div>
            <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-2">
              Car Type *
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="carType"
                name="carType"
                value={formData.carType}
                onChange={handleInputChange}
                className="form-select pl-12"
                required
              >
                <option value="">Select car type</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select service type</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Date */}
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                className="form-input pl-12"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div>
            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleInputChange}
                className="form-select pl-12"
              >
                {passengerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows={4}
            maxLength={500}
            className="form-input resize-none"
            placeholder="Any special requirements or additional information (max 500 characters)"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.specialRequests.length}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full btn-primary text-lg py-4",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Submitting..." : "Book My Ride Now"}
        </button>
      </form>
    </div>
  );
}