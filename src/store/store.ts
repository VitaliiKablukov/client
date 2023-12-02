import { configureStore } from '@reduxjs/toolkit'
// ...
import userReducer from './user/userSlice'
import imagesReducer from './images/imageSlice'
export const store = configureStore({
	reducer: { user: userReducer, images: imagesReducer },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
