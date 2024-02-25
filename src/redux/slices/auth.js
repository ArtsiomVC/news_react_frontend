import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/auth/login', params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchAuthMe', async (values, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/auth/register', values);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  userData: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
    }
  },
  extraReducers: {
    [fetchAuth.pending]: (state, action) => {
      state.userData = null;
      state.isLoading = true;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.isLoading = false;
    },
    [fetchAuth.rejected]: (state) => {
      state.userData = null;
      state.isLoading = false;
    },
    [fetchAuthMe.pending]: (state) => {
      state.userData = null;
      state.isLoading = true;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.isLoading = false;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.userData = null;
      state.isLoading = false;
    },
    [fetchRegister.pending]: (state) => {
      state.userData = null;
      state.isLoading = true;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.isLoading = false;
    },
    [fetchRegister.rejected]: (state) => {
      state.userData = null;
      state.isLoading = false;
    },
  }
});

export const selectIsAuth = state => Boolean(state.auth.userData);

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
