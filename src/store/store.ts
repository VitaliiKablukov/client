import { configureStore } from '@reduxjs/toolkit'
// ...
import userReducer from './user/userSlice'
import imagesReducer from './images/imageSlice'
import commentsReducer from './comments/commentsSlice'
import commentsAnswerReducer from './commentsAnswer/commentsAnswerSlice'
export const store = configureStore({
	reducer: {
		user: userReducer,
		images: imagesReducer,
		comments: commentsReducer,
		commentsAnswer: commentsAnswerReducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
