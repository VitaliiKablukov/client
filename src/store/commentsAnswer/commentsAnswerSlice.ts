import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import { ICommentsAnswer, ICommentsAnswers } from '../../types/types'

interface CommentsState {
	commentsAnswers: ICommentsAnswers | null
	commentAnswer: ICommentsAnswer | null
}

const initialState: CommentsState = {
	commentsAnswers: null,
	commentAnswer: null,
}

export const commentsAnswerSlice = createSlice({
	name: 'commentsAnswers',

	initialState,
	reducers: {
		getAll: (state, action: PayloadAction<ICommentsAnswers>) => {
			state.commentsAnswers = action.payload
		},
		getOne: (state, action: PayloadAction<ICommentsAnswer>) => {
			state.commentAnswer = action.payload
		},
	},
})

export const { getAll } = commentsAnswerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.commentsAnswer

export default commentsAnswerSlice.reducer
