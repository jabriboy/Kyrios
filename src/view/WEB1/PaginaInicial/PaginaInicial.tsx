import { Fragment, useEffect, useState } from "react"
import { User } from "firebase/auth"
import ItemDB from "../../../control/ItemDB"
import Item from "../../../model/interfaces/Item"
import Loading2 from "../Loading/Loading2"
import "./PaginaInicialStyle.css"

export default function PaginaInicial(props: {currentUser: User | null, handleClick: (value: string) => void}){
	const { getLivoItemByUserId } = ItemDB()

	const [data, setData] = useState<{ tipoValor: string; nomeBanco: string; catName: string, id: string; i: Item }[][] | undefined>(undefined)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getData = async () => {
			const allItems = await getLivoItemByUserId(String(props.currentUser?.uid))
			setData(allItems)

			setLoading(false)
		}

		getData()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if(loading) return <Loading2/>
	return(
		<>
			<div className="pagina-inicial">
				<h2>Últimas Transações</h2>
				<div className="div-table">
					<table>
						<thead>
							<tr>
								<th>Data</th>
								<th>Categoria</th>
								<th>Descrição</th>
								<th>Banco</th>
								<th>Entrada</th>
								<th>Saída</th>
							</tr>
						</thead>
						<tbody>
							{data?.map((l, outerIndex) => (
								<Fragment key={`group-${outerIndex}`}>
									{l.slice(0, 5).map((i, innerIndex) => (
									<tr key={`row-${outerIndex}-${innerIndex}`}>
										<td>{i.i.day}-{i.i.month}-{i.i.year}</td>
										<td>{i.catName}</td>
										<td>{i.i.desc}</td>
										<td>{i.nomeBanco}</td>
										<td>{i.tipoValor === 'entrada' ? "R$" + i.i.value.toFixed(2).replace(".", ",") : ""}</td>
										<td>{i.tipoValor === 'saída' ? "R$" + i.i.value.toFixed(2).replace(".", ",") : ""}</td>
									</tr>
									))}
								</Fragment>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}