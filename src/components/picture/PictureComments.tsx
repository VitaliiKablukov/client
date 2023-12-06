import React, { FC, useEffect, useState } from 'react'
import { ImagesService } from '../../services/image.service'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import SocketApi from '../../api/socket.api'
import { getUserIdFromLocalStorage } from '../../helpers/localstorage.helper'
import useConnectSocket from '../../hooks/useConnectSocket'
import { CommentsService } from '../../services/comments.service'
import { IComment } from '../../types/types'
import ReCAPTCHA from 'react-google-recaptcha'

const PictureComments: FC = () => {
	const [reCaptchaToken, setReCaptchaToken] = useState<string | null>('')
	const [picture, setPicture] = useState({})
	const [comments, setComments] = useState([])
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(25)
	const [text, setText] = useState('')
	const { idPicture } = useParams()
	const { id, largeImageURL, tags } = picture
	useConnectSocket()

	const handleRecaptcha = (value: any) => {
		setReCaptchaToken(value)
	}
	const getPictures = async () => {
		try {
			const data = await ImagesService.getOne(idPicture)

			if (data) {
				setPicture(data[0])
			}

			return data
		} catch (err: any) {
			const error = err.response?.data.message
			toast.error(error.toString())
		}
	}
	const sendMessage = async (e) => {
		e.preventDefault()

		if (text === '') {
			return
		}
		SocketApi.socket?.emit('createComment', {
			text,
			userId: +getUserIdFromLocalStorage(),
			imageId: id,
		})
		SocketApi.socket?.on('clientComments', (data) => {
			comments.unshift(data)
			comments.pop()
			console.log(comments)
		})
	}
	const getComments = async () => {
		try {
			const data = await CommentsService.getAllCommentsForPicture(
				idPicture,
				page,
				limit,
			)
			console.log(data)

			if (data) {
				data.comments.map((dat) => comments.push(dat))
			}
		} catch (err: any) {
			const error = err.response?.data.message
			toast.error(error.toString())
		}
	}

	useEffect(() => {
		getPictures()
		getComments()
	}, [])

	return (
		<>
			<div className="flex justify-between flex-col items-center mt-2">
				<h2 className="text-4xl mb-4">{tags}</h2>

				<img src={largeImageURL} alt={tags} />
			</div>
			<form className="p-10" onSubmit={sendMessage}>
				<input
					type="text"
					placeholder="Send your comment"
					className="input w-full"
					onChange={(e) => setText(e.target.value)}
					value={text}
				/>
				<ReCAPTCHA
					// use vite to import env variable
					sitekey={'6LcKeigpAAAAABDBuvLLshY18zOf3iNTQcSZV8In'}
					onChange={handleRecaptcha}
				/>
				<button type="submit" className="btn btn-green ml-auto mt-2">
					Send comment
				</button>
			</form>
			<ul>
				{comments.length >= 1 ? (
					comments.map((comment: IComment) => {
						return (
							<li key={comment.id} className="mb-5 p-4 border-4 rounded-3xl">
								<div className="bg-slate-500 p-2">
									<span className="mr-5">{comment.user.userName}</span>
									{comment.user.email}{' '}
									<span className="ml-4">{comment.createdAt}</span>
								</div>
								<div className="bg-slate-700 p-4">
									<p>{comment.text}</p>
								</div>
							</li>
						)
					})
				) : (
					<div>NO comments</div>
				)}
			</ul>
		</>
	)
}

export default PictureComments
