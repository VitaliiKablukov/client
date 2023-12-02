import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import { IImage } from '../../types/types'

interface ImagesState {
	images: IImage | null
	image: IImage | null
}

const initialState: ImagesState = {
	images: null,
	image: null,
}

export const imagesSlice = createSlice({
	name: 'images',

	initialState,
	reducers: {
		getAll: (state, action: PayloadAction<IImage>) => {
			state.images = action.payload
		},
		getOne: (state, action: PayloadAction<IImage>) => {
			state.image = action.payload
		},
	},
})

export const { getAll, getOne } = imagesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.images

export default imagesSlice.reducer
