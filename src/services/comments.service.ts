import { instance } from '../api/axios.api'
import { IComments } from '../types/types'

export const CommentsService = {
	async getAllCommentsForPicture(
		idPicture: number,
		page: number,
		limit: number,
	): Promise<IComments | undefined> {
		const { data } = await instance.get<IComments>(
			`comments/allCommentsWithPagination/${idPicture}?page=${page}&limit=${limit}`,
		)
		if (data) return data
	},
}
