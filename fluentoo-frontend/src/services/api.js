import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to handle auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it and dispatch logout
      localStorage.removeItem('token');
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  setToken(token) {
    localStorage.setItem('token', token);
  },
  getToken() {
    return localStorage.getItem('token');
  },
  removeToken() {
    localStorage.removeItem('token');
  },
};

export const deckService = {
  getMyDecks: () => api.get('/decks'),
  createDeck: (deckData) => api.post('/decks', deckData),
  getSubjects: () => api.get('/decks/subjects'),
  getPublicDecks: async () => {
    try {
      const response = await api.get('/decks/public');
      console.log('Public decks response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching public decks:', error.response || error);
      throw error;
    }
  },
  getPublicDecksBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/decks/public/subject/${subjectId}`);
      console.log('Public decks by subject response:', response);
      return response;
    } catch (error) {
      console.error(
        'Error fetching public decks by subject:',
        error.response || error
      );
      throw error;
    }
  },
  updateDeck: (id, deckData) => api.put(`/decks/${id}`, deckData),
  deleteDeck: (id) => api.delete(`/decks/${id}`),
  getDeck: (id) => api.get(`/decks/${id}`),
  createFlashcard: (flashcardData) => api.post('/flashcards', flashcardData),
  updateFlashcard: (id, flashcardData) =>
    api.put(`/flashcards/${id}`, flashcardData),
  deleteFlashcard: (id) => api.delete(`/flashcards/${id}`),
};

export const revisionService = {
  getDashboard: () => api.get('/revisions/dashboard'),
  getProgress: () => api.get('/revisions/progress'),
  getRevision: (id) => api.get(`/revisions/${id}`),
  submitAnswer: (id, answerData) =>
    api.post(`/revisions/${id}/answer`, answerData),
  startDeckRevision: (deckId) => api.post(`/revisions/deck?deckId=${deckId}`),
};

export const matchingGameService = {
  startGame: (deckId, gameType = 'MATCHING') =>
    api.post(`/matching-game/start/${deckId}?gameType=${gameType}`),

  submitMatch: (gameId, flashcardId1, flashcardId2) =>
    api.post(`/matching-game/${gameId}/match`, null, {
      params: { flashcardId1, flashcardId2 },
    }),

  completeGame: (gameId) => api.post(`/matching-game/${gameId}/complete`),

  getBestTimes: (deckId) => api.get(`/matching-game/best-times/${deckId}`),

  getRecentGames: () => api.get('/matching-game/recent'),
};

export const userStatsService = {
  getStats: async () => {
    try {
      console.log('Fetching user stats...');
      const response = await api.get('/user/stats');
      console.log('User stats response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },
  getLearningActivity: async () => {
    try {
      console.log('Fetching learning activity...');
      const response = await api.get('/user/learning-activity');
      console.log('Learning activity response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching learning activity:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },
  setDailyGoal: async (goal) => {
    try {
      console.log('Setting daily goal:', goal);
      const response = await api.put(`/user/daily-goal?goal=${goal}`);
      console.log('Set daily goal response:', response);
      return response;
    } catch (error) {
      console.error('Error setting daily goal:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },
};

export default api;
