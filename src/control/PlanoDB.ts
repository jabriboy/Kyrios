import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Plano from "../model/interfaces/Plano"

const PlanoDB = () => {
	
	const getPlano = async () => {
		try{
			const querySnapshot = await getDocs(collection(db, "Plano"))
			return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) || []

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const getPlanoId = async (desc: string) => {
		try{
			const q = query(collection(db, "Plano"), where("desc", "==", `${desc}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""

		} catch(e){
			console.log("Control Error: ", e)
		}
	}
	
	const addPlano = async (plano: Plano) => {
		try{
			const planoAdded = await addDoc(collection(db, "Plano"), plano)
			return planoAdded || {}

		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updatePlano = async (plano: Plano) => {
		try{
			console.log(plano)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removePlano = async (plano: Plano) => {
		try{
			console.log(plano)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getPlano,
		getPlanoId,
		addPlano,
		updatePlano,
		removePlano
	}

}

export default PlanoDB