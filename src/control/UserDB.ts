import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import User from "../model/interfaces/User"

const UserDB = () => {
	
	const getUser = async () => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const allUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

			return allUsers || []

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
		addUser,
		updateUser,
		removeUser
	}

}

export default UserDB