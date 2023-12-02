import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Home'
import PicturesAndComments from '../pages/PicturesAndComments'
import Auth from '../pages/Auth'
import ProtectedRoute from '../components/ProtectedRoute'
import PictureComments from '../components/picture/PictureComments'

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
				path: 'pictures/comments/:idPicture',
				element: (
					<ProtectedRoute>
						<PictureComments />
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
