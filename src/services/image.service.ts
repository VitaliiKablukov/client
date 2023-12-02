import { instance } from '../api/axios.api'
import { IImages } from '../types/types'

export const ImagesService = {
	async getAllPictures(): Promise<IImages | undefined> {
		const { data } = await instance.get<IImages>('images')
		if (data) return data
	},
	async getOne(idPicture: number): Promise<IImages | undefined> {
		const { data } = await instance.get<IImages>(`images/${idPicture}`)
		if (data) return data
	},
}
