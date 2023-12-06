import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { useAppDispatch } from './store/hooks'
import { getTokenFromLocalStorage } from './helpers/localstorage.helper'
import { AuthService } from './services/auth.service'
import { login, logout } from './store/user/userSlice'
import { useEffect } from 'react'
import useConnectSocket from './hooks/useConnectSocket'

function App() {
	useConnectSocket()
	const dispatch = useAppDispatch()

	const checkAuth = async () => {
		const token = getTokenFromLocalStorage()
		try {
			if (token) {
				const data = await AuthService.getProfile()
				if (data) {
					dispatch(login(data))
				} else {
					dispatch(logout())
				}
			}
		} catch (error: any) {
			console.log(error.message)
		}
	}
	useEffect(() => {
		checkAuth()
	}, [])

	return <RouterProvider router={router} />
}

export default App
