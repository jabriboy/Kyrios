import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Switch from "react-switch";
import TipoDB from "../../../control/TipoDB";
import CategoriaDB from "../../../control/CategoriaDB";
import { User } from "firebase/auth";
import './CadastroCategoriaStyle.css'

export default function CadastroCategoria(props: {currentUser: User | null}){
	interface CadastroCategoria {tipo: string, desc: string}

	const { getTipoId } = TipoDB()
	const { addCategoria } = CategoriaDB()

	const [checked, setChecked] = useState(true);
	const [tipo, setTipo] = useState<string | null>("gATJ5fYQPXa4GIWnxulo")
	const [entrada, setEntrada] = useState<string | null>(null)
	const [saida, setSaida] = useState<string | null>(null)
	const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CadastroCategoria>();

	const styleTipo = {
		color: "var(--off-white)",
		transition: ".2s",
		fontWeight: 'bold'
	}

	const onSubmit = async (data: CadastroCategoria) => {
		// console.log("data: ", data)
		await addCategoria({
			UserId: String(props.currentUser?.uid),
			IdTipo: String(tipo),
			desc: data.desc
		})
		reset()
	}

	const handleChange = (nextChecked: boolean) => {
		setChecked(nextChecked);
		setTipo(nextChecked ? String(saida) : String(entrada))
		// console.log(nextChecked ? String(saida) : String(entrada))
		setValue('tipo', nextChecked ? String(saida) : String(entrada))
	};

	useEffect(() => {
		const getData = async () => {
			const entrada = await getTipoId("entrada")
			const saida = await getTipoId("saída")
			
			setEntrada(String(entrada))
			setSaida(String(saida))

		}
		getData()
		
	}, [getTipoId])

	return(
		<>
			<div className="cadastro-categoria">
				<h2>Cadastro Categoria</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
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
					<button type="submit">cadastrar</button>
				</form>
			</div>
		</>
	)
}