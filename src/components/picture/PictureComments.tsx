import React, { FC, useEffect, useState } from 'react'
import { ImagesService } from '../../services/image.service'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

const PictureComments: FC = () => {
	const [picture, setPicture] = useState({})
	const [comment, setComment] = useState('')

	const { idPicture } = useParams()
	const { id, largeImageURL, tags } = picture

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
	useEffect(() => {
		getPictures()
	}, [])

	return (
		<>
			<div className="flex justify-between flex-col items-center mt-2">
				<h2 className="text-4xl mb-4">{tags}</h2>

				<img src={largeImageURL} alt={tags} />
			</div>
			<form className="p-10">
				<input
					type="text"
					placeholder="Send your comment"
					className="input w-full"
					onChange={(e) => setComment(e.target.value)}
					value={comment}
				/>
				<button type="submit" className="btn btn-green ml-auto mt-2">
					Send comment
				</button>
			</form>
		</>
	)
}

export default PictureComments
