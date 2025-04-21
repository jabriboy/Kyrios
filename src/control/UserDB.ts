import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import User from "../model/interfaces/User"
import PlanoDB from './PlanoDB';

const UserDB = () => {
	
	const isNewUser = async (userId: string) => {
		try{
			const q = query(collection(db, "Empresa"), where("IdUser", "==", `${userId}`))
			const empresa = await getDocs(q)

			if(empresa.empty) return true

			return false
			

		}catch (e){
			console.log("Error:", e)
		}
	}

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

	const getUserById = async (id: string) => {
		try{

			const user = await getDoc(doc(db, "User", id))
			let u: User = {UserID: "", StripeUserID: "", IdPlano: "", username: "", email: "", status: ""}
			if(user.exists()){
				u = {
					UserID: user.data().UserID || "",
					StripeUserID: user.data().StripeUserID || "",
					IdPlano: user.data().IdPlano || "",
					username: user.data().username || "",
					email: user.data().email || "",
					status: user.data().status || "",
				}
			}

			return u
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const getUserId = async (email: string) => {
		try{
			const q = query(collection(db, "User"), where("email", "==", `${email}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const getPlanoByEmail = async (email: string) => {
		const { getPlanoByPlanoId } = PlanoDB()
		const q = query(collection(db, "User"), where("email", "==", `${email}`))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.docs.length == 0) return false
		
		const user = querySnapshot.docs.map(doc => {
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
		})

		if(user[0].u.status == 'deactive') return false
		// console.log(user[0].u.IdPlano)
		const plano = await getPlanoByPlanoId(user[0].u.IdPlano)

		return plano
	}

	const checkUsername = async (username: string) => {
		const q = query(collection(db, "User"), where("username", "==", `${username}`))
		const querySnapshot = await getDocs(q)
		console.log(querySnapshot.docs)
		if (querySnapshot.empty) return true
		else return false
	}

	const checkEmail = async (email: string) => {
		const q = query(collection(db, "User"), where("email", "==", `${email}`))
		const querySnapshot = await getDocs(q)
		console.log(querySnapshot.docs)
		if (querySnapshot.empty) return true
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

	const updateUser = async (user: User, id: string) => {
		try{
			await updateDoc(doc(db, "User", id), {
				StripeUserID: user.StripeUserID,
				IdPlano: user.IdPlano,
				username: user.username,
				email: user.email,
				status: user.status,
			})

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
			const querySnapshot = await getDoc(doc(db, "User", id))
			const user = querySnapshot.data()

			await setDoc(doc(db, "User", id), {
				StripeUserID: user?.StripeUserID,
				IdPlano: user?.IdPlano,
				username: user?.username,
				email: user?.email,
				status: status,
			})

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addCusID = async (id: string, cusID: string) => {
		console.log(cusID)
		try {
			// Obter o documento diretamente pelo ID
			const docRef = doc(db, "User", id);
			const docSnapshot = await getDoc(docRef);

			// Verificar se o documento existe
			if (!docSnapshot.exists()) {
				console.error(`Documento com ID ${id} não encontrado.`);
				return;
			}

			// Obter os dados atuais do documento
			const userData = docSnapshot.data();

			// Atualizar o documento com os novos valores
			await updateDoc(docRef, {
				StripeUserID: cusID,
				IdPlano: userData?.IdPlano || "",
				username: userData?.username || "",
				email: userData?.email || "",
				status: userData?.status || "",
			});

			console.log(`Stripe User ID (${cusID}) atualizado com sucesso para o usuário ${id}.`);
		} catch (e) {
			console.error("Erro ao atualizar o documento: ", e);
		}
	};


	const changePriceId = async (id: string, priceid: string) => {
		// console.log("priceId: ", priceid)
		try{
			const querySnapshot = await getDoc(doc(db, "User", id))
			const q = query(collection(db, "Plano"), where("priceId", "==", `${priceid}`))
			const plano = await getDocs(q)
			
			if(plano.empty) return null
			const user = querySnapshot.data()
			
			// console.log(user)
			
			await updateDoc(doc(db, "User", id), {
				StripeUserID: user?.StripeUserID,
				IdPlano: plano.docs[0].id,
				username: user?.username,
				email: user?.email,
				status: user?.status,
			})
			
			// const newUser = await getDoc(doc(db, "User", id))
			// console.log(newUser.data())

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
		getCusIDByUserID,
		getPlanoByEmail,
		getUserById,
		isNewUser
	}

}

export default UserDB