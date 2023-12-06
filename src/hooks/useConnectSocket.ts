import { useEffect, useState } from 'react'
import SocketApi from '../api/socket.api'

const useConnectSocket = async () => {
	// const [comment, setComment] = useState(null)
	const connectSocket = () => {
		SocketApi.createConnection()
	}
	useEffect(() => {
		connectSocket()
	}, [])

	// if (comment) return comment
}
export default useConnectSocket
