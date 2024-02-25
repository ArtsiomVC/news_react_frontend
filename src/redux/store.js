import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { newsReducer } from './slices/news';

const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
  }
});

export default store;
