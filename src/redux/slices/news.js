import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchNews = createAsyncThunk('news/fetchNews', async (searchParams = '') => {
  const { data } = await axios.get(`/news${searchParams}`);
  return data;
});

export const fetchRemoveNews = createAsyncThunk('news/fetchRemoveNews', async (id) => {
  await axios.delete(`/news/${id}`);
});

export const fetchTags = createAsyncThunk('news/fetchTags', async () => {
  const { data } = await axios.get('/news/tags');
  return data;
});

const initialState = {
  news: {
    items: [],
    isLoading: true,
  },
  tags: {
    items: [],
    isLoading: true,
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchNews.pending]: (state) => {
      state.news.items = [];
      state.news.isLoading = true;
    },
    [fetchNews.fulfilled]: (state, action) => {
      state.news.items = action.payload;
      state.news.isLoading = false;
    },
    [fetchNews.rejected]: (state) => {
      state.news.items = [];
      state.news.isLoading = false;
    },
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.isLoading = true;
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.isLoading = false;
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.isLoading = false;
    },
    [fetchRemoveNews.pending]: (state, action) => {
      state.news.items = state.news.items.filter(obj => obj._id !== action.meta.arg);
    },
  }
});

export const newsReducer = newsSlice.reducer;
