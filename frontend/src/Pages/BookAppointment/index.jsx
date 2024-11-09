import React, { useState } from 'react';
import { Calendar, Clock, User, MessageSquare, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '../../UIs/shadcn-ui/button';

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctor: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  // Available time slots per day
  const timeSlots = {
    morning: ['09:00 AM', '10:00 AM', '11:00 AM'],
    afternoon: ['02:00 PM', '03:00 PM', '04:00 PM'],
    evening: ['05:00 PM', '06:00 PM', '07:00 PM']
  };

  // Available doctors and their schedules
  const doctors = [
    { id: 'dr1', name: 'Dr. Smith', speciality: 'Cardiologist', availableDays: [1, 2, 3, 4, 5] },
    { id: 'dr2', name: 'Dr. Johnson', speciality: 'Pediatrician', availableDays: [2, 3, 4, 5, 6] },
    { id: 'dr3', name: 'Dr. Davis', speciality: 'Neurologist', availableDays: [1, 3, 5] }
  ];

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    setAppointmentDetails(prev => ({
      ...prev,
      date: selected.toISOString().split('T')[0]
    }));
  };

  const isDoctorAvailable = (day) => {
    if (!appointmentDetails.doctor) return true;
    const selectedDoctor = doctors.find(d => d.id === appointmentDetails.doctor);
    const dayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay();
    return selectedDoctor?.availableDays.includes(dayOfWeek);
  };

  const renderCalendarDays = () => {
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    for (let day = 1; day <= days; day++) {
      const isToday = day === new Date().getDate() && 
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear();
      
      const isSelected = selectedDate && 
                        day === selectedDate.getDate() &&
                        currentMonth.getMonth() === selectedDate.getMonth() &&
                        currentMonth.getFullYear() === selectedDate.getFullYear();

      const isAvailable = isDoctorAvailable(day);

      calendarDays.push(
        <div 
          key={day}
          className={`h-12 relative cursor-pointer border transition-all duration-200
            ${isAvailable ? 'hover:border-teal-500' : 'opacity-50 cursor-not-allowed'}
            ${isSelected ? 'bg-teal-500 text-white' : isToday ? 'bg-teal-50' : 'bg-white'}
            ${isAvailable ? 'border-gray-100' : 'border-gray-200'}
            rounded-lg`}
          onClick={() => isAvailable && handleDateSelect(day)}
        >
          <span className={`absolute top-1 left-2 text-sm ${isSelected ? 'text-white' : ''}`}>
            {day}
          </span>
        </div>
      );
    }
    return calendarDays;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment Details:', appointmentDetails);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="max-w-6xl font-dm-sans mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-t-2xl">
        <h1 className="text-2xl font-semibold mb-2">Book Your Appointment</h1>
        <p className="text-teal-50">Select your preferred doctor, date, and time for the consultation</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(timeSlots).map(([period, slots]) => (
                    <div key={period} className="space-y-2">
                      <h4 className="text-sm font-medium capitalize text-gray-600">{period}</h4>
                      {slots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setAppointmentDetails(prev => ({ ...prev, time }))}
                          className={`w-full py-2 px-4 rounded-lg text-sm transition-colors
                            ${appointmentDetails.time === time 
                              ? 'bg-teal-500 text-white' 
                              : 'bg-gray-50 text-gray-700 hover:bg-teal-50'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Appointment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="doctor"
                    value={appointmentDetails.doctor}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.speciality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selected Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={appointmentDetails.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selected Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="time"
                    value={appointmentDetails.time}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    placeholder="Select a time slot"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="type"
                    value={appointmentDetails.type}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="virtual">Virtual Consultation</option>
                    <option value="inPerson">In-Person Visit</option>
                    <option value="followUp">Follow-up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea 
                    name="notes"
                    value={appointmentDetails.notes}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any additional information..."
                  ></textarea>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;