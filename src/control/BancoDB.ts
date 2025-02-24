import { collection, getDocs, addDoc, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Banco from "../model/interfaces/Banco"

const BancoDB = () => {
	
	const getBanco = async (IdUser: string, empresaId: string): Promise<{ id: string; b: Banco }[]> => {
		try{
			// console.log(IdUser)
			// console.log(empresaId)
			const q = query(collection(db, "Banco"), where("IdUser", "==", `${IdUser}`), where("IdEmpresa", "==", `${empresaId}`))
			const querySnapshot = await getDocs(q)
			const allBanco = querySnapshot.docs.map(doc => ({
				id: doc.id,
				b: {
					IdUser: doc.data().IdUser || "",
					IdEmpresa: doc.data().IdEmpresa || "",
					type: doc.data().type || "",
					numConta: doc.data().numConta || "",
					nameBanco: doc.data().nameBanco || ""
				}
			}));
			// console.log(allBanco)
			return allBanco || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", b: {IdUser: "", IdEmpresa: "", type: "", numConta: "", nameBanco: ""}}]
		
	}

	const getBancoById = async (id: string) => {
		try{
			const querySnapshot = await getDoc(doc(db, "Banco", id))
			// console.log(querySnapshot.data())
			return querySnapshot.data()
		} catch(e){
			console.log("Control Error: ", e)
		}
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

	// const addBancosValidos = async (listaBancos: string[]) => {
	// 	try{

	// 		for(let i = 0; i < listaBancos.length; i++){
	// 			await addDoc(collection(db, "BancosValidos"), {
	// 				desc: listaBancos[i]
	// 			})
	// 		}

	// 	} catch(e){
	// 		console.log("Control Error: ", e)
	// 	}
	// }

	const getBancosValidos = async () => {
		try{
			const q = query(collection(db, "BancosValidos"))
			const querySnapshot = await getDocs(q)
			const allBanco = querySnapshot.docs.map(doc => ({
				id: doc.id,
				b: {
					desc: String(doc.data().desc) || "",
				}
			}));

			return allBanco || []

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
		removeBanco,
		getBancoById,
		// addBancosValidos
		getBancosValidos
	}

}

export default BancoDB