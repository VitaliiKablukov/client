import { instance } from '../api/axios.api'
import { IComments, ICommentsAnswer } from '../types/types'

export const CommentsService = {
	async getAllCommentsForPicture(
		idPicture: string | undefined,
		page: number,
		limit: number,
	): Promise<IComments | undefined> {
		const { data } = await instance.get<IComments>(
			`comments/allCommentsWithPagination/${idPicture}?page=${page}&limit=${limit}`,
		)
		if (data) return data
	},
	async getOneCommentsForPicture(
		idComment: string | undefined,
	): Promise<ICommentsAnswer | undefined> {
		const { data } = await instance.get<ICommentsAnswer>(
			`comments/${idComment}`,
		)
		if (data) return data
	},
}
