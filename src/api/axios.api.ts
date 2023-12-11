import axios from 'axios'
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper'
export const instance = axios.create({
	baseURL: 'https://spa-jn0u.onrender.com/api',
	headers: {
		Authorization: 'Bearer ' + getTokenFromLocalStorage() || '',
	},
})
// https://spa-jn0u.onrender.com
// http://localhost:3000
