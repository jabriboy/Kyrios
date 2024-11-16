import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Banco from "../model/interfaces/Banco"

const BancoDB = () => {
	
	const getBanco = async (): Promise<{ id: string; b: Banco }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Banco"))
			const allBanco = querySnapshot.docs.map(doc => ({
				id: doc.id,
				b: {
					IdUser: doc.data().IdUser || "",
					type: doc.data().type || "",
					numConta: doc.data().numConta || "",
					nameBanco: doc.data().nameBanco || ""
				}
			}));

			return allBanco || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", b: {IdUser: "", type: "", numConta: "", nameBanco: ""}}]
		
	}

	const getBancoId = async (numConta: string) => {
		try{
			const q = query(collection(db, "Banco"), where("numConta", "==", `${numConta}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addBanco = async (banco: Banco) => {
		try{
			const planoAdded = await addDoc(collection(db, "Banco"), banco)
			return planoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getBanco,
		getBancoId,
		addBanco,
		updateBanco,
		removeBanco
	}

}

export default BancoDB