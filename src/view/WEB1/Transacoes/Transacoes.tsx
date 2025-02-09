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

export default function Transacoes(props: {currentUser: User | null, empresaId: string}){
	const { queryItemsByLivros } = ItemDB()
	const { getLivro } = LivroDB()

	const tableRef = useRef(null);

	const [data, setData] = useState<{ tipoValor: string; nomeBanco: string; catName: string; id: string; i: Item }[] | undefined>(undefined)
	const [livros, setLivro] = useState<{ id: string; l: Livro; }[]>()
	const [livroIdEscolhido, setLivroIdEscolhido] = useState<string>()
	const [loading, setLoading] = useState(true)

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

	const changeFilter = async () => {
		setData(await queryItemsByLivros(String(livroIdEscolhido)))
	}

	useEffect(() => {
		changeFilter()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [livroIdEscolhido])
	  
	useEffect(() => {
		const getData = async () => {
			const livros = await getLivro(props.empresaId)
			setLivro(livros)
			setLivroIdEscolhido(livros[0].id)

			changeFilter()

			setLoading(false)
		}

		getData()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if(loading) return <Loading2/>
	return(
		<>
			<div className="transacoes">
				<div className="box-transacoes">
					<div className="filtro">
						<select
							value={livroIdEscolhido}
							onChange={(event) => {
								setLivroIdEscolhido(event.target.value)
							}}
						>
							{livros?.map((l, index) => {
								return <option key={index} value={l.id}>{l.l.desc}</option>
							})}
						</select>
					</div>
					<h2>Transações</h2>
					<button onClick={handleClick}>baixar extrato</button>
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
								<tr key={`row-${innerIndex}`}>
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
		</>
	)
}