import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import User from "../model/interfaces/User"

const UserDB = () => {
	
	const getUser = async (): Promise<{ id: string; u: User }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const allUsers = querySnapshot.docs.map(doc => ({
				id: doc.id,
				u: {
					UserID: doc.data().UserID || "",
					StripeUserID: doc.data().StripeUserID || "",
					IdPlano: doc.data().IdPlano || "",
					username: doc.data().username || "",
					email: doc.data().email || "",
					status: doc.data().status || "",
				}
			}));

			return allUsers || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", u: {UserID: "", StripeUserID: "", IdPlano: "", username: "", email: "", status: ""}}]
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

	const checkUsername = async (username: string) => {
		const q = query(collection(db, "User"), where("username", "==", `${username}`))
		const querySnapshot = await getDocs(q)
		// console.log(querySnapshot.docs)
		if (querySnapshot.docs.length == 0) return true
		else return false
	}

	const checkEmail = async (email: string) => {
		const q = query(collection(db, "User"), where("email", "==", `${email}`))
		const querySnapshot = await getDocs(q)
		// console.log(querySnapshot.docs)
		if (querySnapshot.docs.length == 0) return true
		else return false
	}
	
	const addUser = async (user: User): Promise<User> => {
		try{
			await setDoc(doc(db, "User", user.UserID), {
				StripeUserID: user.StripeUserID,
				IdPlano: user.IdPlano,
				username: user.username,
				email: user.email,
				status: user.status,
			})

			return {UserID: user.UserID, StripeUserID: user.StripeUserID, IdPlano: user.IdPlano, username: user.username, email: user.email, status: user.status}

		} catch(e){
			console.log("Control Error: ", e)
		}

		return {UserID: "", StripeUserID: "", IdPlano: "", username: "", email: "", status: ""}
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

	const changeStatus = async (id: string, status: string) => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const user = querySnapshot.docs.map((doc) => {
				if(doc.id == id){
					return ({
						id: doc.id,
						u: {
							UserID: doc.data().UserID || "",
							StripeUserID: doc.data().StripeUserID || "",
							IdPlano: doc.data().IdPlano || "",
							username: doc.data().username || "",
							email: doc.data().email || "",
							status: doc.data().status || "",
						}
					})
				}
			});

			await setDoc(doc(db, "User", id), {
				StripeUserID: user[0]?.u.StripeUserID,
				IdPlano: user[0]?.u.IdPlano,
				username: user[0]?.u.username,
				email: user[0]?.u.email,
				status: status,
			})

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addCusID = async (id: string, cusID: string) => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const user = querySnapshot.docs.map((doc) => {
				if(doc.id == id){
					return ({
						id: doc.id,
						u: {
							UserID: doc.data().UserID || "",
							StripeUserID: doc.data().StripeUserID || "",
							IdPlano: doc.data().IdPlano || "",
							username: doc.data().username || "",
							email: doc.data().email || "",
							status: doc.data().status || "",
						}
					})
				}
			});

			await setDoc(doc(db, "User", id), {
				StripeUserID: cusID,
				IdPlano: user[0]?.u.IdPlano,
				username: user[0]?.u.username,
				email: user[0]?.u.email,
				status: user[0]?.u.status,
			})

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const changePriceId = async (id: string, priceid: string) => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const user = querySnapshot.docs.map((doc) => {
				if(doc.id == id){
					return ({
						id: doc.id,
						u: {
							UserID: doc.data().UserID || "",
							StripeUserID: doc.data().StripeUserID || "",
							IdPlano: doc.data().IdPlano || "",
							username: doc.data().username || "",
							email: doc.data().email || "",
							status: doc.data().status || "",
						}
					})
				}
			});

			await setDoc(doc(db, "User", id), {
				StripeUserID: user[0]?.u.StripeUserID,
				IdPlano: priceid,
				username: user[0]?.u.username,
				email: user[0]?.u.email,
				status: user[0]?.u.status,
			})

		} catch(e){
			console.log("Control Error: ", e)
		}
	}
	
	const getCusIDByUserID = async (id: string) => {
		try{
			const querySnapshot = await getDocs(collection(db, "User"))
			const user = querySnapshot.docs.map((doc) => {
				if(doc.id == id){
					return ({
						id: doc.id,
						u: {
							StripeUserID: doc.data().StripeUserID || ""
						}
					})
				}
			});

			return user[0]?.u.StripeUserID

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getUser,
		getUserId,
		addUser,
		updateUser,
		removeUser,
		checkUsername,
		checkEmail,
		changeStatus,
		addCusID,
		changePriceId,
		getCusIDByUserID
	}

}

export default UserDB