import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const instance = axios.create({
  baseURL: 'https://connections-api.herokuapp.com/',
});

const setToken = token => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (formData, thunkApi) => {
    try {
      const { data } = await instance.post('users/login', formData);
      setToken(data.token);

      return data;
    } catch (error) {
      toast.error('Error login');
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logOutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      const { data } = await instance.post('users/logout');
      return data;
    } catch (error) {
      toast.error('Error logout from account');
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/regiter',
  async (formData, thunkApi) => {
    try {
      const { data } = await instance.post('users/signup', formData);
      setToken(data.token);

      return data;
    } catch (error) {
      toast.error('Error regiter account');
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const token = state.auth.token;
      setToken(token);
      const { data } = await instance.get('users/current');
      return data;
    } catch (error) {
      toast.error('Error refresh contacts');
      return thunkApi.rejectWithValue(error.message);
    }
  },
  {
    conditions: (_, thunkApi) => {
      const state = thunkApi.getState();
      const token = state.auth.token;
      if (!token) return false;
      return true;
    },
  }
);
