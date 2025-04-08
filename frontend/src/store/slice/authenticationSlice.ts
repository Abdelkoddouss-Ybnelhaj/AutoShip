import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DecodedToken } from "@/utils/auth";

interface AuthState {
  token: string | null;
  user: DecodedToken | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<DecodedToken>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
