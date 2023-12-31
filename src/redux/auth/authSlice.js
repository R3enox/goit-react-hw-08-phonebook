import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  logOutThunk,
  loginThunk,
  refreshThunk,
  registerThunk,
} from './authThunk';

const defaultStatus = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

const newArr = [loginThunk, registerThunk, refreshThunk, logOutThunk];

const functionStatus = status => newArr.map(el => el[status]);

const handleFulfilled = (state, { payload }) => {
  state.isLoading = false;
  state.authenticated = true;
  state.token = payload.token;
  state.userData = payload.user;
};

const handleFulfilledRefresh = (state, { payload }) => {
  state.isLoading = false;
  state.authenticated = true;
  state.userData = payload;
};

const handleFulfilledLogOut = () => initialState;

const handlePending = (state, {payload}) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};

const initialState = {
  isLoading: false,
  error: null,
  authenticated: false,
  token: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    const { pending, rejected } = defaultStatus;
    builder
      .addCase(loginThunk.fulfilled, handleFulfilled)
      .addCase(registerThunk.fulfilled, handleFulfilled)
      .addCase(refreshThunk.fulfilled, handleFulfilledRefresh)
      .addCase(logOutThunk.fulfilled, handleFulfilledLogOut)
      .addMatcher(isAnyOf(...functionStatus(pending)), handlePending)
      .addMatcher(isAnyOf(...functionStatus(rejected)), handleRejected);
  },
});

export const authReducer = authSlice.reducer;
