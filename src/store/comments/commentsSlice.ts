import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import { IComments } from '../../types/types'

interface CommentsState {
	comments: IComments | null
}

const initialState: CommentsState = {
	comments: null,
}

export const commentsSlice = createSlice({
	name: 'comments',

	initialState,
	reducers: {
		getAll: (state, action: PayloadAction<IComments>) => {
			state.comments = action.payload
		},
	},
})

export const { getAll } = commentsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.images

export default commentsSlice.reducer
