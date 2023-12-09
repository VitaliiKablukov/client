import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useConnectSocket from '../../hooks/useConnectSocket'
import { toast } from 'react-toastify'
import SocketApi from '../../api/socket.api'
import { getUserIdFromLocalStorage } from '../../helpers/localstorage.helper'
import { CommentsAnswerService } from '../../services/commentsAnswer'
import { CommentsService } from '../../services/comments.service'
import { ICommentsAnswer } from '../../types/types'
import ReCAPTCHA from 'react-google-recaptcha'
const AnswersComment: FC = () => {
	const { idComment } = useParams()
	const [reCaptchaToken, setReCaptchaToken] = useState<string | null>('')
	const [comments, setComments] = useState([])
	const [comment, setComment] = useState<ICommentsAnswer | null>(null)
	const [file, setFile] = useState<File | null>(null)
	const [fileType, setFileType] = useState<string>('')
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(25)
	const [text, setText] = useState('')
	useConnectSocket()
	const MAX_IMAGE_WIDTH = 320
	const MAX_IMAGE_HEIGHT = 240

	const handleRecaptcha = (value: string | null) => {
		setReCaptchaToken(value)
	}
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files && e.target.files[0]

		if (selectedFile) {
			if (selectedFile.size > 1000 * 1024) {
				toast.error('The file size should not exceed 100 KB.')
				return
			}

			const allowedFormats = [
				'image/jpeg',
				'image/png',
				'image/gif',
				'text/plain',
			]
			if (!allowedFormats.includes(selectedFile.type)) {
				toast.error('Invalid file format. Please use JPG, PNG, GIF or TXT.')
				return
			}
			setFileType(selectedFile.type)

			const reader = new FileReader()
			reader.onload = (event) => {
				const image = new Image()
				image.src = event.target?.result as string

				image.onload = () => {
					const canvas = document.createElement('canvas')
					let newWidth = image.width
					let newHeight = image.height

					if (image.width > MAX_IMAGE_WIDTH) {
						newWidth = MAX_IMAGE_WIDTH
						newHeight = (MAX_IMAGE_WIDTH / image.width) * image.height
					}

					if (image.height > MAX_IMAGE_HEIGHT) {
						newHeight = MAX_IMAGE_HEIGHT
						newWidth = (MAX_IMAGE_HEIGHT / image.height) * image.width
					}

					canvas.width = newWidth
					canvas.height = newHeight

					const context = canvas.getContext('2d')
					context?.drawImage(image, 0, 0, newWidth, newHeight)

					canvas.toBlob(
						(blob) => {
							const resizedFile = new File([blob as Blob], selectedFile.name, {
								type: selectedFile.type,
								lastModified: Date.now(),
							})

							setFile(resizedFile)
						},
						selectedFile.type,
						0.9,
					)
				}
			}

			reader.readAsDataURL(selectedFile)
		}
	}

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault()

		if (file) {
			const reader = new FileReader()

			reader.onloadend = () => {
				let base64String = ''

				if (fileType === 'text/plain') {
					base64String = reader.result.split(',')[1]
					console.log(base64String, 'is txt')
				} else {
					base64String = reader.result.split(',')[1]
				}
				SocketApi.socket?.emit('createAnswersComment', {
					text,
					userId: +getUserIdFromLocalStorage(),
					commentId: idComment,
					file: base64String,
					type: fileType,
				})

				setText('')
				setFile(null)
			}

			reader.readAsDataURL(file)
		} else {
			SocketApi.socket?.emit('createAnswersComment', {
				text,
				userId: +getUserIdFromLocalStorage(),
				commentId: idComment,
				file: '',
				type: fileType,
			})
			setText('')
		}
	}
	const getComments = async () => {
		try {
			const data = await CommentsAnswerService.getAllCommentsAnswerForPicture(
				+idComment,
				page,
				limit,
			)

			if (data) {
				setComments(data.comments)
			}
		} catch (err: any) {
			const error = err.response?.data.message
			toast.error(error.toString())
		}
	}
	const getComment = async () => {
		try {
			const data = await CommentsService.getOneCommentsForPicture(idComment)

			if (data) {
				setComment(data)
			}

			return data
		} catch (err: any) {
			const error = err.response?.data.message
			toast.error(error.toString())
		}
	}
	useEffect(() => {
		getComment()
		getComments()
		SocketApi.socket?.on('clientAnswerComments', (data) => {
			setComments((prevComments) => {
				const updatedComments = [data, ...prevComments.slice(0, 24)]

				return updatedComments
			})
		})
	}, [])

	return (
		<>
			<div className="bg-slate-500 p-2 flex justify-between">
				<span className="mr-5">{comment?.user.userName}</span>
				{comment?.user.email} <span className="ml-4">{comment?.createdAt}</span>
			</div>
			<div className="bg-slate-700 p-4">
				<p>{comment?.text}</p>
				{comment?.file ? <img src={comment.file} alt="comment image" /> : null}
			</div>
			<form className="p-10" onSubmit={sendMessage}>
				<input
					type="text"
					placeholder="Send your comment"
					className="input w-full"
					onChange={(e) => setText(e.target.value)}
					value={text}
				/>
				<input type="file" onChange={handleFileChange} />
				<div className="flex items-end justify-end mt-4">
					{' '}
					<ReCAPTCHA
						// use vite to import env variable
						sitekey={'6LcKeigpAAAAABDBuvLLshY18zOf3iNTQcSZV8In'}
						onChange={handleRecaptcha}
					/>
				</div>
				<button type="submit" className="btn btn-green ml-auto mt-2">
					Send comment
				</button>
			</form>
			<ul>
				{comments ? (
					comments.map((comment: ICommentsAnswer) => {
						return (
							<li key={comment.id} className="mb-5 p-4 border-4 rounded-3xl">
								<div className="bg-slate-500 p-2 flex justify-between">
									<span className="mr-5">{comment.user.userName}</span>
									{comment.user.email}{' '}
									<span className="ml-4">{comment.createdAt}</span>
								</div>
								<div className="bg-slate-700 p-4">
									<p>{comment.text}</p>
									{comment.file ? (
										<img src={comment.file} alt="comment image" />
									) : null}
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

export default AnswersComment
