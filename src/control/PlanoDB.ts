import { collection, getDocs, addDoc, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Plano from "../model/interfaces/Plano"

const PlanoDB = () => {
	
	const getPlano = async (): Promise<{ id: string; p: Plano }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Plano"))
			const allPlanos = querySnapshot.docs.map(doc => ({
				id: doc.id,
				p: {
					link: doc.data().link || "",
					priceId: doc.data().priceId || "",
					price: doc.data().price || 0,
					duration: doc.data().duration || "",
					desc: doc.data().desc || "",
				}
			}));

			return allPlanos || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", p: {link: "", priceId: "", price: 0, duration: "", desc: ""}}]
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

	const getPlanoByPlanoId = async (planoId: string): Promise<Plano | null> => {
		// console.log("Plano ID => ", planoId)
		try{
			const docSnap = await getDoc(doc(db, "Plano", planoId));

			if (docSnap.exists()) {
				const plano = {
					link: docSnap.data().link,
					desc: docSnap.data().desc,
					priceId: docSnap.data().priceId,
					price: docSnap.data().price,
					duration: docSnap.data().duration
				}
				return plano; // Retorna os dados do documento
			} else {
				console.log("Nenhum documento encontrado com o ID fornecido.");
				return null;
			}
		} catch(e){
			console.log("Control Error: ", e)
		}

		return null
	}

	const getPlanoByPriceId = async (priceId: string): Promise<(Plano | null)> => {
		try{
			const docSnap = await getDocs(query(collection(db, "Plano"), where("priceId", "==", `${priceId}`)));
			if (docSnap.docs.length > 0) {
				const plano = docSnap.docs.map(doc => ({
					link: doc.data().link || "",
					priceId: doc.data().priceId || "",
					price: doc.data().price || 0,
					duration: doc.data().duration || "",
					desc: doc.data().desc || "",
					
				}))
				return plano[0]; // Retorna os dados do documento
			} else {
				console.log("Nenhum documento encontrado com o ID fornecido.");
				return null;
			}
		} catch(e){
			console.log("Control Error: ", e)
		}

		return null
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
		removePlano,
		getPlanoByPlanoId,
		getPlanoByPriceId
	}

}

export default PlanoDB