import { instance } from '../api/axios.api'
import { IComments, IComment } from '../types/types'

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
	async getOneCommentsForPicture(
		idComment: number,
	): Promise<IComment | undefined> {
		const { data } = await instance.get<IComment>(`comments/${idComment}`)
		if (data) return data
	},
}
