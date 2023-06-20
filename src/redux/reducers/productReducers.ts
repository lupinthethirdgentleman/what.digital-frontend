import { createSlice, PayloadAction, Reducer, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
export type Product = {
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number
}

interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null | undefined;
}

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
}


export const fetchProducts = createAsyncThunk<Product[], {debouncedSearchTerm: string, orderKey: string, order: string}>('products/fetchProducts', async ({ debouncedSearchTerm, orderKey, order }) => {
  if (debouncedSearchTerm !== null && debouncedSearchTerm.trim() !== '') {
    const response = await axios.get(`${BASE_URL}/products/search/?search=${debouncedSearchTerm}&orderKey=${order==='INC' ? '' : '-'}${orderKey}`, {withCredentials: true});
    return response.data as Product[];
  } else {
    return [];
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'idle';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export const productReducer: Reducer<ProductState> = productSlice.reducer;