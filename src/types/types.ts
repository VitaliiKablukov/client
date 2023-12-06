export interface IUserData {
	email: string
	password: string
}

export interface IResponseUser {
	email: string | undefined
	userName: string | undefined
	createdAt: string | undefined
	updatedAt: string | undefined
	avatar: string | undefined
	id: number | undefined
	password: string
}
export interface IResponseUserData {
	token: string
	user: IResponseUser
}
export interface IUser {
	id: number
	email: string
	avatar: string
	userName: string
	token: string
}
export interface IImage {
	id: number
	largeImageURL: string
	webformatURL: string
	tags: string
}
export interface IImages {
	images: []
}

export interface IComment {
	id: number
	text: string
	createdAt: string | undefined
	updatedAt: string | undefined
	image: IImage
	user: IResponseUser
}
export interface IComments {
	comments: []
}
