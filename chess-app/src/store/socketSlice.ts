import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
  onlineUsers: number;
}

const initialState: SocketState = {
  connected: false,
  reconnecting: false,
  error: null,
  onlineUsers: 0,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (action.payload) {
        state.reconnecting = false;
        state.error = null;
      }
    },
    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<number>) => {
      state.onlineUsers = action.payload;
    },
    clearSocketError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConnected,
  setReconnecting,
  setError,
  setOnlineUsers,
  clearSocketError,
} = socketSlice.actions;

export default socketSlice.reducer;