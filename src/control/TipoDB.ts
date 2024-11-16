import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Tipo from "../model/interfaces/Tipo"

const TipoDB = () => {
	
	const getTipo = async (): Promise<{ id: string; t: Tipo }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Tipo"))
			const allTipos = querySnapshot.docs.map(doc => ({
				id: doc.id,
				t: {
					desc: doc.data().desc || ""
				}
			}));

			return allTipos || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", t: {desc: ""}}]
	}

	const getTipoId = async (desc: string) => {
		try{
			const q = query(collection(db, "Tipo"), where("desc", "==", `${desc}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addTipo = async (tipo: Tipo) => {
		try{
			const tipoAdded = await addDoc(collection(db, "Tipo"), tipo)
			return tipoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getTipo,
		getTipoId,
		addTipo,
		updateTipo,
		removeTipo
	}

}

export default TipoDB