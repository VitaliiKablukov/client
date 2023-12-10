import { instance } from '../api/axios.api'
import { IImages, IImage } from '../types/types'

export const ImagesService = {
	async getAllPictures(): Promise<IImages | undefined> {
		const { data } = await instance.get<IImages>('images')
		if (data) return data
	},
	async getOne(idPicture: string | undefined): Promise<IImage | undefined> {
		const { data } = await instance.get<IImage>(`images/${idPicture}`)
		if (data) return data
	},
}
