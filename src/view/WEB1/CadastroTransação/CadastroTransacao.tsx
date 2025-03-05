import { useForm } from "react-hook-form";
import Switch from "react-switch";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CategoriaDB from "../../../control/CategoriaDB";
import BancoDB from "../../../control/BancoDB";
import Categoria from "../../../model/interfaces/Categoria";
import Banco from "../../../model/interfaces/Banco";
import { User } from "firebase/auth";
import Loading2 from "../Loading/Loading2";
import './CadastroTransacaoStyle.css'
import TipoDB from "../../../control/TipoDB";
import ItemDB from "../../../control/ItemDB";
import Item from "../../../model/interfaces/Item";
import Livro from "../../../model/interfaces/Livro";
import LivroDB from "../../../control/LivroDB";
import EmpresaDB from "../../../control/EmpresaDB";
import CadastroLivro from "../CadastroLivro/CadastroLivro";
import CadastroBanco from "../CadastroBanco/CadastroBanco";
import CadastroCategoria from "../CadastroCategoria/CadastroCategoria";

export default function CadastroTransacao(props: {currentUser: User | null, empresaId: string, planoDesc: string | null, loading: Dispatch<SetStateAction<string>>, setCurrentComponent: (value: string) => void, handleClick: (value: string) => void}) {
	interface CadastroTransacao {livro: string, categoria: string, desc: string, tipo: string, valor: number, data: string, banco: string}

	const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CadastroTransacao>();
	const { getCategoria } = CategoriaDB()
	const { getBanco } = BancoDB()
	const { getTipoId } = TipoDB()
	const { addItem } = ItemDB()
	const { getLivro } = LivroDB()
	const { updateSaldo } = EmpresaDB()

	const [checked, setChecked] = useState(true);

	const [categoria, setCategoria] = useState<{id: string, c: Categoria}[]>()
	const [banco, setBanco] = useState<{id: string, b: Banco}[]>()
	const [livro, setLivro] = useState<{id: string, l: Livro}[]>()
	const [entrada, setEntrada] = useState<string | null>(null)
	const [saida, setSaida] = useState<string | null>(null)
	const [loading, setLoading] = useState(true);
	const [tipo, setTipo] = useState<string | null>(null)

	const styleTipo = {
		color: "var(--off-white)",
		transition: ".2s",
		fontWeight: 'bold'
	}

	const handleChange = (nextChecked: boolean) => {
		setChecked(nextChecked);
		setTipo(nextChecked ? String(saida) : String(entrada))
		console.log(nextChecked ? String(saida) : String(entrada))
		setValue('tipo', nextChecked ? String(saida) : String(entrada))
	};

	const onSubmit = async (data: CadastroTransacao) => {
		console.log('Cadastro:', data)
		const dia = data.data.split("-")[2]
		const mes = data.data.split("-")[1]
		const ano = data.data.split("-")[0]

		const transacao: Item = {
			IdCategoria: data.categoria,
			IdBanco: data.banco,
			IdLivro: data.livro,
			desc: data.desc,
			value: data.valor,
			day: dia,
			month: mes,
			year: ano
		}
		setLoading(true)
		
		await addItem(transacao)
		await updateSaldo(props.empresaId, data.valor, String(tipo))
		
		setLoading(false)
		 
		reset()
	};
	
	useEffect(() => {
		const getData = async () => {
			const categoria = await getCategoria(String(props.currentUser?.uid))
			setCategoria(categoria ?? [])
			
			const banco = await getBanco(String(props.currentUser?.uid), String(props.empresaId))
			setBanco(banco ?? [])
			
			const livro = await getLivro(String(props.empresaId))
			// console.log(livro)
			setLivro(livro ?? [])
			
			const entrada = await getTipoId("entrada")
			const saida = await getTipoId("saída")
			
			setEntrada(String(entrada))
			setSaida(String(saida))
			
			setLoading(false)
			
			props.loading('block')
		}
		
		getData()

	}, [props.currentUser?.uid, getBanco, getCategoria, getTipoId, props.empresaId, getLivro, props])

	if (loading) {
		props.loading('none')
		return <Loading2/>
	}
	if (livro?.length == 0) {
		props.loading('none')
		return <CadastroLivro setCurrentComponent={props.setCurrentComponent} handleClick={props.handleClick} empresaId={props.empresaId} currentUser={props.currentUser} planoDesc={props.planoDesc}/>
	}
	if (banco?.length == 0) {
		props.loading('none')
		return <CadastroBanco setCurrentComponent={props.setCurrentComponent} handleClick={props.handleClick} loading={props.loading} currentUser={props.currentUser} planoDesc={props.planoDesc} empresa={props.empresaId}/>
	}
	if (categoria?.length == 0) { 
		props.loading('none')
		return <CadastroCategoria currentUser={props.currentUser}/>
	}
	return(
		<>
			{/* {console.log("aqui")} */}
			<div className="cadastroTransacao">
				<h2>Cadastro Transação</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="inputLivro">
						<p>livro caixa</p>
						<select 
							id="livro"
							{...register("livro", { required: true })}
							>
						{livro?.map((l) => {
							return (
								<option key={l.id} value={l.id}>{l.l.desc}</option>
							)
						})}
						</select>

						
						{errors.livro?.message && <p>{String(errors.livro.message)}</p>}
					</div>

					<div className="inputTipo">
						<p style={checked ? {} : styleTipo}>entrada</p>
						<Switch
							onChange={handleChange}
							checked={checked}
							uncheckedIcon={false}
							checkedIcon={false}
							offColor="#4caf50"
							onColor="#f44336"
							id="tipo"
						/>
						<p style={checked ? styleTipo : {}}>saída</p>
						{errors.tipo?.message && <p>{String(errors.tipo.message)}</p>}
					</div>

					<div className="inputCategoria">
						<p>categoria</p>
						<select 
							id="categoria"
							{...register("categoria", { required: true })}
						>
							{categoria?.map((c) => {
								// console.log(tipo)
								if(c.c.IdTipo == tipo){
									return (
										<option key={c.id} value={c.id}>{c.c.desc}</option>
									)
								}
								if(tipo == null){
									if(c.c.IdTipo == saida){
										return (
											<option key={c.id} value={c.id}>{c.c.desc}</option>
										)
									}
								}
							})}
						</select>

						
						{errors.categoria?.message && <p>{String(errors.categoria.message)}</p>}
					</div>
					{/* <button className="add-categoria">+</button> */}

					<div className="inputDesc">
						<p>descrição</p>
						<input 
						{...register("desc", { required: true })}
						type="text"
						id="desc" 
						placeholder="descrição"
						/>
						{errors.desc?.message && <p>{String(errors.desc.message)}</p>}
					</div>

					<div className="inputValor">
						<p>valor</p>
						<input 
						{...register("valor", {
							required: "O valor é obrigatório",
							valueAsNumber: true,
							validate: (value) => !isNaN(value) || "Digite um número válido",
						  })}
						type="number"
						id="valor"
						step="0.01" // Permite decimais
          				min="0"
						placeholder="R$ xxx,xx"
						/>
						{errors.desc?.message && <p>{String(errors.desc.message)}</p>}
					</div>

					<div className="inputData">
						<p>data</p>
						<input 
						{...register("data", { required: true })}
						type="date"
						id="data" 
						/>
						{errors.desc?.message && <p>{String(errors.desc.message)}</p>}
					</div>

					<div className="inputBanco">
						<p>banco</p>
						<select 
							id="banco"
							{...register("banco", { required: true })}
						>
						{banco?.map((b) => {
							return (
								<option key={b.id} value={b.id}>{b.b.nameBanco}</option>
							)
						})}
						</select>
						
						{errors.categoria?.message && <p>{String(errors.categoria.message)}</p>}
					</div>

					<button type="submit">Enviar</button>
				</form>
			</div>
		</>
	)
}