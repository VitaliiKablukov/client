import io, { Socket } from 'socket.io-client'
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper'

class SocketApi {
	token = getTokenFromLocalStorage()
	static socket: null | Socket = null

	static createConnection(): void {
		this.socket = io('http://localhost:3000/', {
			extraHeaders: {
				Authorization: `Bearer ` + getTokenFromLocalStorage() || '',
			},
		})
		this.socket.on('connect', (): void => {
			console.log('connected')
		})
		this.socket.on('disconnect', (): void => {
			console.log('disconnect')
		})
	}
}
export default SocketApi
