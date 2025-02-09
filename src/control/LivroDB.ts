import { collection, getDocs, addDoc, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Livro from "../model/interfaces/Livro"
import UserDB from './UserDB';

const LivroDB = () => {
	
	const getLivro = async (empresaId: string): Promise<{ id: string; l: Livro }[]> => {
		try{
			const q = query(collection(db, "Livro"), where("IdEmpresa", "==", `${empresaId}`))
			const querySnapshot = await getDocs(q)
			const allLivro = querySnapshot.docs.map(doc => ({
				id: doc.id,
				l: {
					IdEmpresa: doc.data().IdEmpresa || "",
					desc: doc.data().desc || ""
				}
			}));

			return allLivro || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", l: {IdEmpresa: "", desc: ""}}]
	}

	const getLivroById = async (id: string) => {
		try{
			const querySnapshot = await getDoc(doc(db, "Livro", id))
			console.log(querySnapshot.data())
			return querySnapshot.data()
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const getLivroId = async (email: string, desc: string) => {
		const { getUserId } = UserDB()
		try{
			const q = query(collection(db, "Livro"), where("IdUser", "==", `${await getUserId(email)}`), where("desc", "==", `${desc}`))

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

	
	return{
		getLivro,
		getLivroId,
		addLivro,
		getLivroById
	}

}

export default LivroDB