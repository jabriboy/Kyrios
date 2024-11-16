import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import User from "../model/interfaces/User"

const UserDB = () => {
	
	const getUser = async (): Promise<{ id: string; u: User }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const allUsers = querySnapshot.docs.map(doc => ({
				id: doc.id,
				u: {
					IdPlano: doc.data().IdPlano || "",
					username: doc.data().username || "",
					email: doc.data().email || "",
					password: doc.data().password || ""
				}
			}));

			return allUsers || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", u: {IdPlano: "", username: "", email: "", password: ""}}]
	}

	const getUserId = async (username: string) => {
		try{
			const q = query(collection(db, "User"), where("username", "==", `${username}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}
	
	const addUser = async (user: User) => {
		try{
			const userAdded = await addDoc(collection(db, "User"), user)
			return userAdded || {}

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateUser = async (user: User) => {
		try{
			console.log(user)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeUser = async (user: User) => {
		try{
			console.log(user)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getUser,
		getUserId,
		addUser,
		updateUser,
		removeUser
	}

}

export default UserDB