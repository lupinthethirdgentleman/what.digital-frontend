import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import { productReducer } from './reducers/productReducers'
import sessionReducer from './reducers/sessionReducer'
// ...

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    session: sessionReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch