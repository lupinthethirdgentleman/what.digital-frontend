import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface UserState {
  email: string | undefined
}

// Define the initial state using that type
const initialState: UserState = {
  email: undefined
}

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    REGISTER_SUCCESS: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    LOGIN_SUCCESS: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    SESSION_SUCCESS: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    LOGOUT_SUCCESS: (state) => {
      state.email = undefined
    },
  }
})

export const { REGISTER_SUCCESS,LOGIN_SUCCESS, SESSION_SUCCESS } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default userSlice.reducer