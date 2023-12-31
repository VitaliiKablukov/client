import { FC } from 'react'
import { IImage } from '../../types/types'
import { Link } from 'react-router-dom'
import { IImages } from '../../types/types'

const Picture: FC<{ pictures: IImages | [] }> = ({ pictures }) => {
	if (Array.isArray(pictures)) {
		return (
			<ul className="mt-20">
				{pictures &&
					pictures.map((picture: IImage) => {
						const { id: idPicture, largeImageURL, tags } = picture

						return (
							<li key={idPicture} className="mb-10">
								<img src={largeImageURL} alt={tags} />
								<div className="flex justify-between items-center mt-2">
									<h2 className="text-xxl">{tags}</h2>

									<Link to={`comments/${idPicture}`}>
										<button className="btn btn-red">Comments</button>
									</Link>
								</div>
							</li>
						)
					})}
			</ul>
		)
	} else {
		return (
			<>
				<div>Pictures Error</div>
			</>
		)
	}
}

export default Picture
