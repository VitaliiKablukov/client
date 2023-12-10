import { useEffect } from 'react'
import SocketApi from '../api/socket.api'

const useConnectSocket = async () => {
	const connectSocket = () => {
		SocketApi.createConnection()
	}
	useEffect(() => {
		connectSocket()
	}, [])
}
export default useConnectSocket
