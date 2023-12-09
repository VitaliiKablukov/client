import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import { IComment, IComments } from '../../types/types'

interface CommentsState {
	comments: IComments | null
	comment: IComment | null
}

const initialState: CommentsState = {
	comments: null,
	comment: null,
}

export const commentsSlice = createSlice({
	name: 'comments',

	initialState,
	reducers: {
		getAll: (state, action: PayloadAction<IComments>) => {
			state.comments = action.payload
		},
		getOne: (state, action: PayloadAction<IComment>) => {
			state.comment = action.payload
		},
	},
})

export const { getAll, getOne } = commentsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.comments

export default commentsSlice.reducer
