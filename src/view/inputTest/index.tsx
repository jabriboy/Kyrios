import BancoDB from "../../control/BancoDB"
import CategoriaDB from "../../control/CategoriaDB"
import ItemDB from "../../control/ItemDB"
import LivroDB from "../../control/LivroDB"
import PlanoDB from "../../control/PlanoDB"
import TipoDB from "../../control/TipoDB"
import UserDB from "../../control/UserDB"

export default function Index(){

	const { getPlano, addPlano } = PlanoDB()
	const { getUserId } = UserDB()
	const { getBancoId, addBanco, getBanco } = BancoDB()
	const { addCategoria, getCategoria, getCategoriaId } = CategoriaDB()
	const { getTipo, getTipoId, addTipo } = TipoDB()
	const { addLivro, getLivroId, getLivro } = LivroDB()
	const { addItem, getItem } = ItemDB()

	return(
		<>
			<button onClick={async () => {
				await addPlano({
					desc: "premium",
					value: 59.90
				})
				console.log("Plano: ", await getPlano())
			}}>add plano</button>

			<button onClick={async () => {
				const categorias = [{desc: "entrada"}, {desc: "saída"}]
				categorias.map(async (i) => {
					await addTipo(i)
				})
				console.log("Tipo: ", await getTipo())
			}}>add tipos</button>

			<button onClick={async () => {
				const categorias = [{IdTipo: String(await getTipoId("saída")), desc: "energia"}]
				categorias.map(async (i) => {
					await addCategoria(i)
				})
				console.log("Categoria: ", await getCategoria())
			}}>add categorias</button>

			<button onClick={async () => {
				const categorias = [{IdUser: String(await getUserId("jabriboy")), desc: "Livro 2024"}]
				categorias.map(async (i) => {
					await addLivro(i)
				})
				console.log("Livro: ", await getLivro())
			}}>add livro</button>

			<button onClick={async () => {
				const categorias = [
					{
						IdUser: String(await getUserId("jabriboy")),
						type: "corrente",
						numConta: "0123456789",
						nameBanco: "Banco Inter"
					}
				]
				categorias.map(async (i) => {
					await addBanco(i)
				})
				console.log("Banco: ", await getBanco())
			}}>add banco</button>

			<button onClick={async () => {
				const categorias = [
					{
						IdLivro: String(await getLivroId("jabriboy", "Livro 2024")), 
						IdCategoria: String(await getCategoriaId("energia")),
						IdBanco: String(await getBancoId("0123456789")),
						desc: "pagamento da conta de energia",
						value: 569.34,
						day: "1",
						month: "1",
						year: "2024"
					}
				]
				categorias.map(async (i) => {
					await addItem(i)
				})
				console.log("Item: ", await getItem())
			}}>add item</button>
		</>
	)
}