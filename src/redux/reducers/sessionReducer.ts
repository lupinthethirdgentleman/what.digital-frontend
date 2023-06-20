import { createSlice, PayloadAction, Reducer, createAsyncThunk } from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios'
import { BASE_URL } from '../../config';
export interface SessionState {
  search: string,
  orderKey: string,
  order: string,
  selected: number[]
}

// Define the initial state using that type
const initialState: SessionState = {
  search: '',
  orderKey: 'id',
  order: 'INC',
  selected: []
}

interface SelectedItem {
  id: number
}

export const selectProduct = createAsyncThunk<SelectedItem, number, { rejectValue: { errorMessage: string }}> ("session/selectProduct", async (id: number, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/select/?id=${id}` , {withCredentials: true})
    return response.data as SelectedItem
  } catch (error) {
    const axiosError = error as AxiosError;
    return thunkAPI.rejectWithValue({ errorMessage: axiosError.message || 'Unknown error occurred' });
  }
});

export const sessionSlice = createSlice({
  name: 'session',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    search: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    orderKey: (state, action: PayloadAction<string>) => {
      state.orderKey = action.payload

    },
    order: (state, action: PayloadAction<string>) => {
      state.order = action.payload

    },
    selected: (state, action: PayloadAction<[]>) => {
      state.selected = action.payload
    },
    logout: (state) => {
      state.selected = initialState.selected
      state.order = initialState.order
      state.orderKey = initialState.orderKey
      state.search = initialState.search
    }
  },
  extraReducers: (builder) => {
    builder.addCase(selectProduct.pending, (state) => {
    })
    .addCase(selectProduct.fulfilled, (state, action: PayloadAction<SelectedItem>) => {
      const {id} = action.payload
      const selected = [...state.selected]
      const index = selected.indexOf(Number(id))
      if(index !== -1) {
        selected.splice(index, 1);
      } else {
        selected.push(Number(id));
      }
      state.selected = [...selected]
    })
    .addCase(selectProduct.rejected, (state, action) => {
    });
  }

})

export const { search, orderKey, selected, logout } = sessionSlice.actions

// Other code such as selectors can use the imported `RootState` type
export default sessionSlice.reducer