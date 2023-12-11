import { FC, useEffect, useState } from 'react'
import { ImagesService } from '../services/image.service.ts'
import Image from '../components/picture/Picture'
import { toast } from 'react-toastify'
import { IImages } from '../types/types.ts'

const PicturesAndComments: FC = () => {
	const [pictures, setPictures] = useState<IImages | []>([])
	console.log(pictures)

	const getPictures = async () => {
		try {
			const data = await ImagesService.getAllPictures()
			console.log(data)

			if (data) {
				setPictures(data)
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
			<Image pictures={pictures} />
		</>
	)
}

export default PicturesAndComments
