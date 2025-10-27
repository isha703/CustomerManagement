import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: string;
  name?: string;
  email?: string;
  roles?: string[];
  // allow additional fields from backend
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialAuthState = (): AuthState => ({
  user: null,
  loading: false,
  error: null,
});

const initialState: AuthState = initialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // set full user object (backwards-compatible)
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    // setLoggedUser: merge provided fields into current user (id, name, email, roles, etc.)
    setLoggedUser(state, action: PayloadAction<Partial<User>>) {
      state.user = {
        ...(state.user ?? {}),
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },

    // resetAuth: clear user and reset auth flags
    resetAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    // optional helpers
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, setLoggedUser, resetAuth, setLoading, setError } = authSlice.actions;

// selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
