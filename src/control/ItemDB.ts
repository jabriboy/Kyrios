import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../model/firebaseConfig';
import Item from "../model/interfaces/Item"
import CategoriaDB from './CategoriaDB';
import LivroDB from './LivroDB';
import TipoDB from './TipoDB';
import EmpresaDB from './EmpresaDB';
import BancoDB from './BancoDB';

const ItemDB = () => {
	interface OFX {OFX: {BANKMSGSRSV1: {STMTTRNRS: {STMTRS: {BANKTRANLIST: {STMTTRN: [{MEMO: string, CHECKNUM: string,DTPOSTED: string, FITID: string, REFNUM: string, TRNAMT: string, TRNTYPE: string,}]}}}}}}

	const getLivoItemByUserId = async (userId: string): Promise<{ tipoValor: string; nomeBanco: string; catName: string; id: string; i: Item; }[][] | undefined> => {
		const { getEmpresa } = EmpresaDB();
		const { getCategoriaById } = CategoriaDB();
		const { getTipoById } = TipoDB();
		const { getBancoById } = BancoDB();
	  
		try {
		  const empresas = await getEmpresa(userId);

			// ajeitar para receber o id da empresa desejada 

		  const livroItems = await getItem(empresas[0].id);
	  
		  const newLivroItems = await Promise.all(
			livroItems.map(async (subArray) => {
				return Promise.all(
				subArray.map(async (i) => {
					// console.log(i)
					const cat = await getCategoriaById(i.i.IdCategoria);
					// console.log("categoria", cat)
					const tipo = await getTipoById(cat.c.IdTipo);
					// console.log("tipo", tipo)
					const banco = await getBancoById(i.i.IdBanco);
		
					return {
						...i,
						tipoValor: tipo.t.desc === 'entrada' ? 'entrada' : 'saída',
						nomeBanco: String(banco?.nameBanco),
						catName: String(cat.c.desc)
					};
				})
				);
			})
		  );
	  
		  return newLivroItems;
		} catch (e) {
		  console.log("Control Error: ", e);
		}
	};

	const getItemByLivro = async (livroId: string) => {
		try{

			const q = query(
				collection(db, "Item"), 
				where("IdLivro", "==", `${livroId}`),
				orderBy("day"),
				orderBy("month"),
				orderBy("year")
			)

			const querySnapshot = await getDocs(q)
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

	const queryItemsByLivros = async (livroId: string) => {
		const { getCategoriaById } = CategoriaDB();
		const { getTipoById } = TipoDB();
		const { getBancoById } = BancoDB();
	  
		try {
			const livroItems = await getItemByLivro(livroId)
		
			const newLivroItems = await Promise.all(
				livroItems.map(async (i) => {
					const cat = await getCategoriaById(i.i.IdCategoria);
					const tipo = await getTipoById(cat.c.IdTipo);
					const banco = await getBancoById(i.i.IdBanco);
		
					return {
						...i,
						tipoValor: tipo.t.desc === 'entrada' ? 'entrada' : 'saída',
						nomeBanco: String(banco?.nameBanco),
						catName: String(cat.c.desc)
					};
				})
			);
	  
		  return newLivroItems;
		} catch (e) {
		  console.log("Control Error: ", e);
		}
	}
	  

	const getItem = async (empresaId: string): Promise<{ id: string; i: Item }[][]> => {
		try{
			const { getLivro } = LivroDB()
			const livros = await getLivro(empresaId)
			const todosItens = []

			for(let i = 0; i < livros.length; i++){

				const q = query(
					collection(db, "Item"), 
					where("IdLivro", "==", `${livros[i].id}`),
					orderBy("day"),
					orderBy("month"),
					orderBy("year")
				)
				const querySnapshot = await getDocs(q)
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

				todosItens.push(allItem)
			}

			return todosItens || []

		} catch(e){
			console.log("Control Error: ", e)
		}

		return [[{id: "", i: {IdLivro:  "", IdCategoria:  "", IdBanco: "", desc: "", value: 0, day: "", month: "", year: "",  }}]]
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

	const addManyByJson = async (data: {json: OFX | unknown, file: string} | undefined, bancoID: string, livroId: string) => {
		const { getCategoria } = CategoriaDB()
		const { getTipoId } = TipoDB()
		const { updateSaldo } = EmpresaDB()
		const { getLivroById } = LivroDB()
		
		// check if is ofx or csv
		if(data?.file == 'ofx'){
			const tranlist = (data.json as OFX).OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN

			for(let i = 0; i < tranlist.length; i++){
				const transaction = tranlist[i]

				const day = transaction.DTPOSTED.substring(6, 8)
				const month = transaction.DTPOSTED.substring(4, 6)
				const year = transaction.DTPOSTED.substring(0, 4)

				const valor = transaction.TRNAMT //string
				let valorReal = 0

				const allCategoria = await getCategoria()
				let filteredCategoria = []
				let tipo = ""

				if(valor.slice(0, 1) == '-'){
					valorReal = Number(valor.slice(1, valor.length).replace(",", "."))
					const saida = await getTipoId('saída')
					tipo = String(saida)
					// console.log("saída", saida)
					filteredCategoria = allCategoria.filter((c) => 
						c.c.desc === 'outro' && c.c.IdTipo === saida
					);
					console.log("saída", filteredCategoria[0].id)
				} else {
					valorReal = Number(valor.replace(",", "."))
					const entrada = await getTipoId('entrada')
					tipo = String(entrada)
					// console.log("entrada", entrada)
					filteredCategoria = allCategoria.filter((c) => 
						c.c.desc === 'outro' && c.c.IdTipo === entrada
					);
					console.log("entrada", filteredCategoria[0].id)
				}

				const item: Item = {
					desc: transaction.MEMO,
					day: day,
					month: month,
					year: year,
					value: valorReal,
					IdBanco: bancoID,
					IdCategoria: filteredCategoria[0].id,
					IdLivro: livroId
				}

				await addItem(item)
				const liv = await getLivroById(livroId)
				await updateSaldo(liv?.IdEmpresa, valorReal, tipo)
			}
		} else {
			// addManyByBank
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
		removeItem,
		addManyByJson,
		getLivoItemByUserId,
		queryItemsByLivros
	}

}

export default ItemDB