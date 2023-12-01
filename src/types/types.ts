export interface IUserData {
	email: string
	password: string
}

export interface IResponseUser {
	email: string | undefined
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
	token: string
}
