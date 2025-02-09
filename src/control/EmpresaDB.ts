import { collection, getDocs, addDoc, query, where, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import UserDB from './UserDB';
import Empresa from '../model/interfaces/Empresa';
import ItemDB from './ItemDB';
import CategoriaDB from './CategoriaDB';
import TipoDB from './TipoDB';
import Item from '../model/interfaces/Item';

const EmpresaDB = () => {
	
	const getEmpresa = async (idUser: string): Promise<{ id: string; e: Empresa }[]> => {
		try{
			const q = query(collection(db, "Empresa"), where("IdUser", "==", `${idUser}`))
			const querySnapshot = await getDocs(q)
			const allEmpresa = querySnapshot.docs.map(doc => ({
				id: doc.id,
				e: {
					IdUser: doc.data().IdUser || "",
					desc: doc.data().desc || "",
					area: doc.data().area || "",
					saldo: doc.data().saldo || 0
				}
			}));

			return allEmpresa || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [{id: "", e: {IdUser: "", desc: "", area: "", saldo: 0}}]
	}

	const getEmpresaId = async (email: string, desc: string) => {
		const { getUserId } = UserDB()
		try{
			const q = query(collection(db, "Empresa"), where("IdUser", "==", `${await getUserId(email)}`), where("desc", "==", `${desc}`))

			const querySnapshot = await getDocs(q)
			const id = querySnapshot.docs.map(doc => ({ id: doc.id }))

			return id[0].id || ""
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addEmpresa = async (empresa: Empresa) => {
		try{
			const planoAdded = await addDoc(collection(db, "Empresa"), empresa)
			return planoAdded || {}
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const calcSaldoTotal = async (allItems: {id: string, i: Item}[][]) => {
		const { getCategoriaById } = CategoriaDB()
		const { getTipoById } = TipoDB()
		let saldoTotal = 0
		for(let i = 0; i < allItems.length; i++){
			for(let j = 0; j < allItems[i].length; j++){
				const idCategoria = allItems[i][j].i.IdCategoria
				const categoria = await getCategoriaById(idCategoria)
				const tipo = await getTipoById(categoria?.c.IdTipo) 
				if(tipo.t.desc == 'entrada'){
					saldoTotal = saldoTotal + allItems[i][j].i.value
				} else{
					saldoTotal = saldoTotal - allItems[i][j].i.value
				}
			}
		}

		return saldoTotal
	}

	const updateCalcSaldo = async (empresaId: string) => {
		const { getItem } = ItemDB()
		try{
			const allItems = await getItem(empresaId)

			const saldo =  await calcSaldoTotal(allItems)
			await setDoc(doc(db, "Empresa", empresaId), {
				saldo: saldo
			}, {merge: true})

			return "saldo alterado"
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateSaldo = async (empresaId: string, valor: number, tipoId: string) => {
		const { getTipoId } = TipoDB()
		try{
			const empresa = await getDoc(doc(db, "Empresa", empresaId))
			const data = empresa.data()
			let saldo = data?.saldo
			console.log(saldo)
			if(tipoId == (await getTipoId("entrada"))){
				saldo += valor
			} else {
				saldo -= valor
			}

			await setDoc(doc(db, "Empresa", empresaId), {
				saldo: saldo
			}, {merge: true})

			return "saldo alterado"
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getEmpresa,
		getEmpresaId,
		addEmpresa,
		updateCalcSaldo,
		updateSaldo
	}

}

export default EmpresaDB