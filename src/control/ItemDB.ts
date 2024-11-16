import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Item from "../model/interfaces/Item"

const ItemDB = () => {
	
	const getItem = async (): Promise<{ id: string; i: Item }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Item"))
			const allItem = querySnapshot.docs.map(doc => ({
				id: doc.id,
				i: {
					IdLivro: doc.data().IdLivro || "",
					IdCategoria: doc.data().IdCategoria || "",
					IdBanco: doc.data().IdBanco || "",
					desc: doc.data().desc || "",     
					value: doc.data().value || 0,     
					day: doc.data().day || "",     
					month: doc.data().month || "",     
					year: doc.data().year || "",     
				}
			}));

			return allItem || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", i: {IdLivro:  "", IdCategoria:  "", IdBanco: "", desc: "", value: 0, day: "", month: "", year: "",  }}]
	}

	const getItemId = async (item: Item) => {
		try{
			const q = query(collection(db, "Item"), where("IdLivro", "==", `${item.IdLivro}`), where("IdCategoria", "==", `${item.IdCategoria}`), where("IdBanco", "==", `${item.IdBanco}`), where("desc", "==", `${item.desc}`), where("value", "==", `${item.value}`), where("day", "==", `${item.day}`), where("month", "==", `${item.month}`), where("year", "==", `${item.year}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addItem = async (item: Item) => {
		try{
			const planoAdded = await addDoc(collection(db, "Item"), item)
			return planoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getItem,
		getItemId,
		addItem,
		updateItem,
		removeItem
	}

}

export default ItemDB