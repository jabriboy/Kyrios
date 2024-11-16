import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Livro from "../model/interfaces/Livro"
import UserDB from './UserDB';

const LivroDB = () => {
	
	const getLivro = async (): Promise<{ id: string; l: Livro }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "Livro"))
			const allLivro = querySnapshot.docs.map(doc => ({
				id: doc.id,
				l: {
					IdUser: doc.data().IdUser || "",
					desc: doc.data().desc || ""
				}
			}));

			return allLivro || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", l: {IdUser: "", desc: ""}}]
	}

	const getLivroId = async (username: string, desc: string) => {
		const { getUserId } = UserDB()
		try{
			const q = query(collection(db, "Livro"), where("IdUser", "==", `${await getUserId(username)}`), where("desc", "==", `${desc}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addLivro = async (livro: Livro) => {
		try{
			const planoAdded = await addDoc(collection(db, "Livro"), livro)
			return planoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getLivro,
		getLivroId,
		addLivro,
		updateLivro,
		removeLivro
	}

}

export default LivroDB