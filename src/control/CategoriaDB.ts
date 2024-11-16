import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Categoria from "../model/interfaces/Categoria"

const CategoriaDB = () => {
	
	const getCategoria = async (): Promise<{ id: string; c: Categoria }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Categoria"))
			const allCategoria = querySnapshot.docs.map(doc => ({
				id: doc.id,
				c: {
					IdTipo: doc.data().IdTipo || "",
					desc: doc.data().desc || ""
				}
			}));

			return allCategoria || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", c: {IdTipo: "", desc: ""}}]
	}

	const getCategoriaId = async (desc: string) => {
		try{
			const q = query(collection(db, "Categoria"), where("desc", "==", `${desc}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addCategoria = async (categoria: Categoria) => {
		try{
			const tipoAdded = await addDoc(collection(db, "Categoria"), categoria)
			return tipoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getCategoria,
		getCategoriaId,
		addCategoria,
		updateCategoria,
		removeCategoria
	}

}

export default CategoriaDB