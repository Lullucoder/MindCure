// Appointment Service - API calls for booking therapy sessions

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const appointmentService = {
  // Get list of available counselors
  async getCounselors() {
    const response = await fetch(`${API_BASE}/appointments/counselors`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch counselors');
    return response.json();
  },

  // Get available time slots for a counselor on a date
  async getAvailableSlots(counselorId, date) {
    const params = new URLSearchParams({ counselorId, date });
    const response = await fetch(`${API_BASE}/appointments/slots?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch available slots');
    return response.json();
  },

  // Book an appointment
  async bookAppointment(data) {
    const response = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to book appointment');
    }
    return response.json();
  },

  // Get my appointments
  async getMyAppointments(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.upcoming) params.append('upcoming', 'true');
    
    const response = await fetch(`${API_BASE}/appointments/my?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  // Update appointment status
  async updateStatus(appointmentId, data) {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  },

  // Cancel appointment
  async cancelAppointment(appointmentId, reason = '') {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to cancel appointment');
    return response.json();
  }
};

export default appointmentService;
