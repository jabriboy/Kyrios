import { useEffect, useState, useRef } from "react"
import { User } from "firebase/auth"
import ItemDB from "../../../control/ItemDB"
import Item from "../../../model/interfaces/Item"
import Loading2 from "../Loading/Loading2"
import './TransacoesStyle.css'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import LivroDB from "../../../control/LivroDB"
import Livro from "../../../model/interfaces/Livro"
import Categoria from "../../../model/interfaces/Categoria"
import CategoriaDB from "../../../control/CategoriaDB"
import Switch from "react-switch";	
import TipoDB from "../../../control/TipoDB"
import Banco from "../../../model/interfaces/Banco"
import BancoDB from "../../../control/BancoDB"
import EmpresaDB from "../../../control/EmpresaDB"

export default function Transacoes(props: {currentUser: User | null, empresaId: string, block: boolean}){
	const { queryItemsByMonth, updateItem, removeItem, queryItemsByMonthAndCategoria } = ItemDB()
	const { getLivro } = LivroDB()
	const { getCategoria, getCategoriaById } = CategoriaDB()
	const { getTipoId } = TipoDB()
	const { getBanco } = BancoDB()
	const { updateSaldo } = EmpresaDB()

	const tableRef = useRef(null);

	const meses = ["todos os meses", "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]

	const [mes, setMes] = useState("0")
	const [data, setData] = useState<{ tipoValor: string; nomeBanco: string; catName: string; id: string; i: Item }[] | undefined>(undefined)
	const [livros, setLivro] = useState<{ id: string; l: Livro; }[]>()
	const [livroIdEscolhido, setLivroIdEscolhido] = useState<string>()
	const [loading, setLoading] = useState(true)
	const [openModal, setOpenModal] = useState(false)
	const [dadosModal, setDadosModal] = useState<null | { tipoValor: string; nomeBanco: string; catName: string; id: string; i: Item; }>(null)
	const [categoria, setCategoria] = useState<{id: string, c: Categoria}[]>()
	const [categoriaEscolhida, setCategoriaEscolhida] = useState<string>()
	const [tipo, setTipo] = useState<string | null>(null)
	const [checked, setChecked] = useState(true);
	const [entrada, setEntrada] = useState<string | null>(null)
	const [saida, setSaida] = useState<string | null>(null)
	const [banco, setBanco] = useState<{id: string, b: Banco}[]>()
	const [IdCat, setIdCat] = useState(dadosModal?.i.IdCategoria)

	const handleClick = async () => {
		if (!tableRef.current) return;
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Dados");
		
		if (!tableRef.current) return [];
		const tableElement = tableRef.current as HTMLTableElement; // Garante o tipo correto

		const rows = Array.from(tableElement.querySelectorAll("tr")).map((row) => Array.from((row as HTMLTableRowElement).querySelectorAll("th, td")).map((cell) => (cell as HTMLTableCellElement).textContent?.trim() || ""));
	  
		rows.forEach((row, rowIndex) => {
		  const formattedRow = row.map((cell, colIndex) => {
			if (rowIndex > 0 && (colIndex === 4 || colIndex === 5)) { // Colunas Entrada e Saída
			  const cleanValue = cell.replace(/[^\d,.-]+/g, "").replace(",", "."); // Remove "R$" e ajusta decimal
			  const numericValue = parseFloat(cleanValue);
	  
			  return isNaN(numericValue) ? cell : numericValue;
			}
			return cell;
		  });
	  
		  const excelRow = worksheet.addRow(formattedRow);
	  
		  excelRow.eachCell((cell, colIndex) => {
			cell.border = {
			  top: { style: "thin", color: { argb: "000000" } },
			  left: { style: "thin", color: { argb: "000000" } },
			  bottom: { style: "thin", color: { argb: "000000" } },
			  right: { style: "thin", color: { argb: "000000" } },
			};
	  
			if (rowIndex === 0) {
			  cell.font = { bold: true };
			  cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "D9D9D9" },
			  };
			}
	  
			if (rowIndex > 0 && (colIndex === 5 || colIndex === 6) && typeof cell.value === "number") {
			  cell.numFmt = "R$ #,##0.00"; // Formato numérico com símbolo de moeda
			}
	  
			if (rowIndex > 0) {
			  if (colIndex === 5) {
				cell.font = { color: { argb: "008000" }, bold: true };
			  }
			  if (colIndex === 6) {
				cell.font = { color: { argb: "FF0000" }, bold: true };
			  }
			}
		  });
		});
	  
		worksheet.columns = [
		  { header: "Data", width: 25 },
		  { header: "Categoria", width: 20 },
		  { header: "Descrição", width: 30 },
		  { header: "Banco", width: 20 },
		  { header: "Entrada", width: 15 },
		  { header: "Saída", width: 15 },
		];
	  
		const buffer = await workbook.xlsx.writeBuffer();
		saveAs(new Blob([buffer]), "dados.xlsx");
	};

	const handleChecked = (nextChecked: boolean) => {
		setChecked(nextChecked);
		setTipo(nextChecked ? String(saida) : String(entrada))
		// console.log(nextChecked ? String(saida) : String(entrada))
		// setIdCat()
	};

	const changeLivro = async (e: string) => {
		setLoading(true)
		setLivroIdEscolhido(e)
		setData(await queryItemsByMonth(e, mes))
		setLoading(false)
	}

	const changeMes = async (e: string) => {
		setLoading(true)
		setMes(e)
		setData(await queryItemsByMonth(String(livroIdEscolhido), e))
		setLoading(false)
	}

	const changeCategoria = async (e: string) => {
		setLoading(true)
		setCategoriaEscolhida(e)
		setData(await queryItemsByMonthAndCategoria(String(livroIdEscolhido), mes, e))
		setLoading(false)
	}
	
	const updateData = async () => {
		setLoading(true)
		setData(await queryItemsByMonth(livroIdEscolhido ?? "", mes))
		setLoading(false)
	}
	
	useEffect(() => {
		const getData = async () => {
			const categoria = await getCategoria(String(props.currentUser?.uid))
			setCategoria(categoria ?? [])
			
			const banco = await getBanco(String(props.currentUser?.uid), props.empresaId)
			setBanco(banco ?? [])
			
			const entrada = await getTipoId("entrada")
			const saida = await getTipoId("saída")
			
			setEntrada(String(entrada))
			setSaida(String(saida))
			
			const livros = await getLivro(props.empresaId)
			setLivro(livros)
			
			let value = 0
			for(let i = 0; i <= livros.length; i++){
				const data = await queryItemsByMonth(livros[i]?.id, mes)
				if(data?.length != 0){
					value = i 
					break
				} 
			}
			setLivroIdEscolhido(livros[value].id)
			setData(await queryItemsByMonth(livros[value]?.id, mes))
			
			setLoading(false)
		}
		
		getData()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// console.log(categoria)
		if(categoria && categoria?.filter(c => c.c.IdTipo === tipo || (tipo == null && c.c.IdTipo === saida)).length == 1) {
			// console.log(1)
			// console.log(categoria[0].id)
			setIdCat(categoria[0].id)
			setDadosModal({
				catName: categoria[0].c.desc,
				nomeBanco: String(dadosModal?.nomeBanco),
				tipoValor: String(dadosModal?.tipoValor),
				id: String(dadosModal?.id),
				i: {
					IdLivro: dadosModal?.i.IdLivro ?? "",
					IdCategoria: categoria[0].id ?? "",
					IdBanco: dadosModal?.i.IdBanco ?? "",
					desc: dadosModal?.i.desc ?? "",
					value: dadosModal?.i.value ?? 0, 
					day: dadosModal?.i.day ?? "",
					month: dadosModal?.i.month ?? "",
					year: dadosModal?.i.year ?? "",
				}
			})
		}

	}, [categoria, dadosModal?.i.IdBanco, dadosModal?.i.IdLivro, dadosModal?.i.day, dadosModal?.i.desc, dadosModal?.i.month, dadosModal?.i.value, dadosModal?.i.year, dadosModal?.id, dadosModal?.nomeBanco, dadosModal?.tipoValor, saida, tipo])

	if(loading) return <Loading2/>
	return(
		<>
			<div className="transacoes" style={{
				display: openModal ? "none" : "block"
			}}>
				<div className="box-transacoes">
					<div className="filtro">
						<div className="filtro-livro">
							<p>livro</p>
							<select
								value={livroIdEscolhido}
								onChange={(event) => {
									changeLivro(event.target.value)
								}}
							>
								{livros?.map((l, index) => {
									return <option key={index} value={l.id}>{l.l.desc}</option>
								})}
							</select>
						</div>
						<div className="filtro-mes">
							<p>Mês</p>
							<select
								value={mes}
								onChange={(event) => {
									changeMes(event.target.value)
								}}
							>
								{meses?.map((m, index) => {
									return <option key={index} value={index}>{m}</option>
								})}
							</select>
						</div>
						<div className="filtro-categoria">
							<p>Categoria</p>
							<select
								value={categoriaEscolhida}
								onChange={(event) => {
									changeCategoria(event.target.value)
								}}
							>
								<option value={""}></option>
								{categoria?.map((m, index) => {
									return <option key={index} value={m.id}>{m.c.desc}</option>
								})}
							</select>
						</div>
					</div>
					<h2>Transações</h2>
					<button className="extrato" onClick={handleClick}>baixar extrato</button>
				</div>
				<div className="div-table">
					<table ref={tableRef}>
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
							{data?.map((i, innerIndex) => (
								<tr className="row" key={`row-${innerIndex}`} onClick={() => {
									if(props.block) {alert("Oops! Não é possível fazer essa ação com o plano Gratuito, veja nosso planos em: www.sejakyrios.com.br/planos")}
									else{
										setOpenModal(!openModal)
										setDadosModal(i)
									}
								}}>
									<td>{i.i.day}-{i.i.month}-{i.i.year}</td>
									<td>{i.catName}</td>
									<td>{i.i.desc}</td>
									<td>{i.nomeBanco}</td>
									{/* <td>{i.tipoValor === 'entrada' ? "R$ " + i.i.value.toFixed(2) : ""}</td>
									<td>{i.tipoValor === 'saída' ? "R$ " + i.i.value.toFixed(2) : ""}</td> */}
									<td>{i.tipoValor === 'entrada' ? "R$ " + i.i.value.toFixed(2).replace(".", ",") : ""}</td>
									<td>{i.tipoValor === 'saída' ? "R$ " + i.i.value.toFixed(2).replace(".", ",") : ""}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="background" style={{
				display: openModal ? "flex" : "none"
			}}>
				<div className="modal-transacao">
					<span onClick={() => {setOpenModal(!openModal)}}>X</span>

					<h1>Item de Transação</h1>
					<div className="info">
						<h3>Data:</h3>
						<input type="date" value={`${dadosModal?.i.year}-${dadosModal?.i.month}-${dadosModal?.i.day}`} onChange={(e) => {
							setDadosModal({
								catName: String(dadosModal?.catName),
								nomeBanco: String(dadosModal?.nomeBanco),
								tipoValor: String(dadosModal?.tipoValor),
								id: String(dadosModal?.id),
								i: {
									IdLivro: dadosModal?.i.IdLivro ?? "",
									IdCategoria: dadosModal?.i.IdCategoria ?? "",
									IdBanco: dadosModal?.i.IdBanco ?? "",
									desc: dadosModal?.i.desc ?? "",
									value: dadosModal?.i.value ?? 0, 
									day: e.target.value.split("-")[2] ?? "",
									month: e.target.value.split("-")[1] ?? "",
									year: e.target.value.split("-")[0] ?? "",
								}
							})
						}}/>
					</div>
					<div className="info">
						<h3>Categoria:</h3>
						<select id="categoria" value={IdCat} onChange={async (e) => {
							setIdCat(e.target.value)
							const cat = await getCategoriaById(e.target.value)
							// console.log(e.target.value)

							setDadosModal({
								catName: cat.c.desc,
								nomeBanco: String(dadosModal?.nomeBanco),
								tipoValor: String(dadosModal?.tipoValor),
								id: String(dadosModal?.id),
								i: {
									IdLivro: dadosModal?.i.IdLivro ?? "",
									IdCategoria: e.target.value ?? "",
									IdBanco: dadosModal?.i.IdBanco ?? "",
									desc: dadosModal?.i.desc ?? "",
									value: dadosModal?.i.value ?? 0, 
									day: dadosModal?.i.day ?? "",
									month: dadosModal?.i.month ?? "",
									year: dadosModal?.i.year ?? "",
								}
							})
						}}>
							{ categoria
								?.filter(c => c.c.IdTipo === tipo || (tipo == null && c.c.IdTipo === saida))
								.map(c => (
									<option key={c.id} value={c.id}>
										{c.c.desc}
									</option>
								)) }
						</select>
					</div>
					<div className="info">
						<h3>Desc.:</h3>
						<input type="text" name="desc" id="desc" value={dadosModal?.i.desc} onChange={(e) => {
							setDadosModal({
								catName: String(dadosModal?.catName),
								nomeBanco: String(dadosModal?.nomeBanco),
								tipoValor: String(dadosModal?.tipoValor),
								id: String(dadosModal?.id),
								i: {
									IdLivro: dadosModal?.i.IdLivro ?? "",
									IdCategoria: dadosModal?.i.IdCategoria ?? "",
									IdBanco: dadosModal?.i.IdBanco ?? "",
									desc: e.target.value ?? "",
									value: dadosModal?.i.value ?? 0, 
									day: dadosModal?.i.day ?? "",
									month: dadosModal?.i.month ?? "",
									year: dadosModal?.i.year ?? "",
								}
							})
						}}/>
					</div>
					<div className="info">
						<h3>Banco:</h3>
						<select 
							id="banco"
							value={dadosModal?.nomeBanco}
							onChange={(e) => {
								setDadosModal({
									catName: String(dadosModal?.catName),
									nomeBanco: String(dadosModal?.nomeBanco),
									tipoValor: String(dadosModal?.tipoValor),
									id: String(dadosModal?.id),
									i: {
										IdLivro: dadosModal?.i.IdLivro ?? "",
										IdCategoria: dadosModal?.i.IdCategoria ?? "",
										IdBanco: e.target.value ?? "",
										desc: dadosModal?.i.desc ?? "",
										value: dadosModal?.i.value ?? 0, 
										day: dadosModal?.i.day ?? "",
										month: dadosModal?.i.month ?? "",
										year: dadosModal?.i.year ?? "",
									}
								})
							}}
						>
							{banco?.map((b) => {
								return (
									<option key={b.id} value={b.id}>{b.b.nameBanco}</option>
								)
							})}
						</select>
					</div>
					<div className="info">
						<h3>entrada</h3>
						<Switch
							onChange={handleChecked}
							checked={checked}
							uncheckedIcon={false}
							checkedIcon={false}
							offColor="#4caf50"
							onColor="#f44336"
							id="tipo"
							/>
						<h3>saída</h3>
					</div>
					<div className="info">
						<h3>Valor:</h3>
						<p>R$</p>
						<input type="number" name="valor" id="valor" value={dadosModal?.i.value} onChange={(e) => {
							setDadosModal({
								catName: String(dadosModal?.catName),
								nomeBanco: String(dadosModal?.nomeBanco),
								tipoValor: String(dadosModal?.tipoValor),
								id: String(dadosModal?.id),
								i: {
									IdLivro: dadosModal?.i.IdLivro ?? "",
									IdCategoria: dadosModal?.i.IdCategoria ?? "",
									IdBanco: dadosModal?.i.IdBanco ?? "",
									desc: dadosModal?.i.desc ?? "",
									value: Number(e.target.value), 
									day: dadosModal?.i.day ?? "",
									month: dadosModal?.i.month ?? "",
									year: dadosModal?.i.year ?? "",
								}
							})
						}}/>
					</div>

					<div className="btn">
						<button onClick={() => {
							if(dadosModal?.i) updateItem(String(dadosModal?.id), dadosModal?.i);
							setOpenModal(!openModal)
							updateData()
						}} className="btn-edit">editar dados</button>

						<button onClick={async () => {
							removeItem(String(dadosModal?.id))
							let tipoId
							if(dadosModal?.tipoValor == 'entrada'){
								tipoId = await getTipoId('saída')
							} else {
								tipoId = await getTipoId('entrada')
							}
							await updateSaldo(props.empresaId, Number(dadosModal?.i.value), String(tipoId)) 
							setOpenModal(!openModal)
							updateData()
						}} className="btn-del">excluir item</button>
					</div>
				</div>
			</div>
		</>
	)
}