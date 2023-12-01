import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Home'
import PicturesAndComments from '../pages/PicturesAndComments'
import Auth from '../pages/Auth'
import ProtectedRoute from '../components/ProtectedRoute'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: 'pictures',
				element: (
					<ProtectedRoute>
						<PicturesAndComments />
					</ProtectedRoute>
				),
			},
			{
				path: 'auth',
				element: <Auth />,
			},
		],
	},
])
