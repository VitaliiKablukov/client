import { instance } from '../api/axios.api'
import { ICommentsAnswer, ICommentsAnswers } from '../types/types'

export const CommentsAnswerService = {
	async getAllCommentsAnswerForPicture(
		idComment: number,
		page: number,
		limit: number,
	): Promise<ICommentsAnswers | undefined> {
		const { data } = await instance.get<ICommentsAnswers>(
			`answers-comments/allCommentsWithPagination/${idComment}?page=${page}&limit=${limit}`,
		)
		if (data) return data
	},
	// async getOneCommentsForPicture(
	// 	idPicture: number,
	// 	idComment: number,
	// ): Promise<ICommentsAnswer | undefined> {
	// 	const { data } = await instance.get<ICommentsAnswer>(
	// 		`comments/allCommentsWithPagination/${idPicture}/${idComment}`,
	// 	)
	// 	if (data) return data
	// },
}
