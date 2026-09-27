import api from './api';

export const registrationService = {
  async registerForEvent(eventId) {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  async getStudentRegistrations(studentId) {
    const response = await api.get(`/students/${studentId}/registrations`);
    return response.data;
  },

  async cancelRegistration(registrationId) {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  },
};

export default registrationService;
