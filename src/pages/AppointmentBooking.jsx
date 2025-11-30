import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import appointmentService from '../services/appointmentService';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Select counselor, 2: Select date/time, 3: Confirm
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);

  // Fetch counselors on mount
  useEffect(() => {
    fetchCounselors();
    fetchMyAppointments();
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedCounselor, selectedDate]);

  const fetchCounselors = async () => {
    try {
      const { counselors } = await appointmentService.getCounselors();
      setCounselors(counselors);
    } catch (err) {
      setError('Failed to load counselors');
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const { appointments } = await appointmentService.getMyAppointments({ upcoming: true });
      setMyAppointments(appointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const { availableSlots } = await appointmentService.getAvailableSlots(
        selectedCounselor._id,
        selectedDate
      );
      setAvailableSlots(availableSlots);
    } catch (err) {
      setError('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      setError('');
      
      await appointmentService.bookAppointment({
        counselorId: selectedCounselor._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: sessionType,
        reason
      });

      setSuccess(true);
      setShowBooking(false);
      fetchMyAppointments();
      
      // Reset form
      setTimeout(() => {
        setStep(1);
        setSelectedCounselor(null);
        setSelectedDate('');
        setSelectedSlot('');
        setReason('');
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await appointmentService.cancelAppointment(appointmentId);
      fetchMyAppointments();
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Therapy Sessions</h1>
        <p className="text-gray-600">Schedule one-on-one sessions with our professional counselors</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Appointment Booked Successfully!</p>
            <p className="text-sm text-green-600">You'll receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* My Appointments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Book New Session
          </button>
        </div>

        {myAppointments.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-gray-600">No upcoming appointments</p>
            <button
              onClick={() => setShowBooking(true)}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Book your first session →
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {myAppointments.map((apt) => (
              <div key={apt._id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {apt.counselor?.firstName} {apt.counselor?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(apt.date)} • {apt.timeSlot}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">• {apt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'confirmed' && apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Join Session
                    </a>
                  )}
                  {['pending', 'confirmed'].includes(apt.status) && (
                    <button
                      onClick={() => handleCancelAppointment(apt._id)}
                      className="px-4 py-2 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Book a New Session</h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Counselor */}
          {step === 1 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Select a Counselor</h3>
              {counselors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No counselors available at the moment</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {counselors.map((counselor) => (
                    <div
                      key={counselor._id}
                      onClick={() => {
                        setSelectedCounselor(counselor);
                        setStep(2);
                      }}
                      className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        selectedCounselor?._id === counselor._id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                          {counselor.firstName?.[0]}{counselor.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {counselor.firstName} {counselor.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{counselor.email}</p>
                        </div>
                      </div>
                      {counselor.bio && (
                        <p className="text-sm text-gray-600 mt-3">{counselor.bio}</p>
                      )}
                      {counselor.specializations?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {counselor.specializations.map((spec, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedCounselor && (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">
                Select Date & Time with {selectedCounselor.firstName}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="video">📹 Video Call</option>
                    <option value="audio">📞 Audio Call</option>
                    <option value="chat">💬 Chat</option>
                    <option value="in-person">🏥 In-Person</option>
                  </select>
                </div>
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">Loading slots...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      No available slots for this date. Please try another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                            selectedSlot === slot
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Confirm Your Booking</h3>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Counselor</span>
                    <span className="font-medium">{selectedCounselor.firstName} {selectedCounselor.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type</span>
                    <span className="font-medium capitalize">{sessionType}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe what you'd like to discuss..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Booking...' : '✓ Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
