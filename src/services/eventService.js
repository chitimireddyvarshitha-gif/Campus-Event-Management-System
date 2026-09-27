import api from './api';

export const eventService = {
  async getEvents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/events${queryString}`);
    return response.data;
  },

  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  async updateEvent(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  async getAdminEvents() {
    const response = await api.get('/admin/events');
    return response.data;
  },

  async getEventRegistrations(eventId) {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  async getAdminDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async resetDatabase() {
    const response = await api.post('/seed/reset');
    return response.data;
  },

  async getDatabaseExport() {
    const response = await api.get('/db/export');
    return response.data;
  },
};

export default eventService;
