import React, { FC, useEffect, useState } from 'react'
import { ImagesService } from '../../services/image.service'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import SocketApi from '../../api/socket.api'
import { getUserIdFromLocalStorage } from '../../helpers/localstorage.helper'
import useConnectSocket from '../../hooks/useConnectSocket'
import { CommentsService } from '../../services/comments.service'
import { IComment, IImage } from '../../types/types'
import ReCAPTCHA from 'react-google-recaptcha'

const PictureComments: FC = () => {
	// @ts-ignore
	const [reCaptchaToken, setReCaptchaToken] = useState<string | null>('')
	const [picture, setPicture] = useState<IImage>()
	const [comments, setComments] = useState<IComment[]>([])
	const [file, setFile] = useState<File | null>(null)

	const [fileType, setFileType] = useState<string>('')
	// @ts-ignore
	const [page, setPage] = useState(1)
	// @ts-ignore
	const [limit, setLimit] = useState(25)
	const [text, setText] = useState('')

	const { idPicture } = useParams()
	// @ts-ignore
	const { id, largeImageURL, tags } = picture || {}
	useConnectSocket()
	const MAX_IMAGE_WIDTH = 320
	const MAX_IMAGE_HEIGHT = 240

	const handleRecaptcha = (value: string | null) => {
		setReCaptchaToken(value)
	}
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files && e.target.files[0]

		if (selectedFile) {
			if (selectedFile.size > 100 * 1024) {
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
	const getPictures = async () => {
		try {
			const data = await ImagesService.getOne(idPicture)

			if (data) {
				// @ts-ignore
				setPicture(data[0])
			}

			return data
		} catch (err: any) {
			const error = err.response?.data.message
			toast.error(error.toString())
		}
	}
	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault()

		if (file) {
			const reader = new FileReader()

			reader.onloadend = () => {
				let base64String = ''
				console.log('reader')

				if (fileType === 'text/plain') {
					base64String = reader.result?.toString().split(',')[1] ?? ''
				} else {
					base64String = reader.result?.toString().split(',')[1] ?? ''
				}
				SocketApi.socket?.emit('createComment', {
					text,
					userId: +getUserIdFromLocalStorage(),
					imageId: id,
					file: base64String,
					type: fileType,
				})

				setText('')
				setFile(null)
			}

			reader.readAsDataURL(file)
		} else {
			SocketApi.socket?.emit('createComment', {
				text,
				userId: +getUserIdFromLocalStorage(),
				imageId: id,
				file: '',
				type: fileType,
			})
			setText('')
		}
	}
	const getComments = async () => {
		try {
			const data = await CommentsService.getAllCommentsForPicture(
				idPicture,
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

	useEffect(() => {
		getPictures()
		getComments()
		SocketApi.socket?.on('clientComments', (data) => {
			setComments((prevComments) => {
				const updatedComments: IComment[] = [data, ...prevComments.slice(0, 24)]

				return updatedComments
			})
		})
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
				{comments.length >= 1 ? (
					comments.map((comment: IComment) => {
						return (
							<li key={comment.id} className="mb-5 p-4 border-4 rounded-3xl">
								<div className="bg-slate-500 p-2 flex justify-between">
									<span className="mr-5">{comment.user.userName}</span>
									{comment.user.email}{' '}
									<span className="ml-4">{comment.createdAt}</span>
									<Link to={`${comment.id}`}>
										<button className="btn btn-red">Comments</button>
									</Link>
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

export default PictureComments
