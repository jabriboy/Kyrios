import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BancoDB from "../../../control/BancoDB";
import Loading2 from "../Loading/Loading2";
import { User } from "firebase/auth";
import './CadastroBancoStyle.css'
import Loading from "../Loading/Loading";

export default function CadastroBanco(props: {currentUser: User | null, planoDesc: string | null}){
	interface cadBanco {nameBanco: string, numConta: string, type: string}

	const { register, handleSubmit, formState: { errors }, reset } = useForm<cadBanco>();
	const { addBanco, getBancosValidos } = BancoDB()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(true);
	const [bancos, setBancos] = useState<{ id: string; b: { desc: string; }; }[] | undefined>(undefined)

	const onSubmit = async (data: cadBanco) => {
		setLoading(true)
		await addBanco({
			IdUser: String(props.currentUser?.uid),
			nameBanco: data.nameBanco,
			numConta: data.numConta,
			type: data.type
		})
		setLoading(false)
		reset()
		
		navigate('/')
	};

	useEffect(() => {
		async function getData(){
			const bank = await getBancosValidos()
			setBancos(bank)
		}
		getData()
		setLoading(false)
	}, [getBancosValidos])

	if (loading) {return <Loading2/>}
	if (!props.planoDesc?.includes("premium") && !props.planoDesc?.includes("diamond")) {return <Loading/>}
	return(
		<>
			<div className="cadastro-banco">
				<h2>Cadastro de Conta Bancária</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="input-nameBanco">
						<p>Banco</p>
						<select
							id="nameBanco"
							{...register("nameBanco", { required: true })}
							>
							{bancos?.map((b) => {
								// console.log(tipo)
								return (
									<option key={b.id} value={b.b.desc}>{b.b.desc}</option>
								)
							})}
						</select>
						{errors.nameBanco?.message && <p>{String(errors.nameBanco.message)}</p>}
					</div>
					<div className="input-numConta">
						<p>Número da conta</p>
						<input
						id='numConta'
						type="text"
						{...register("numConta", { required: true })}
						placeholder="Número da conta"
						/>
						{errors.numConta?.message && <p>{String(errors.numConta.message)}</p>}
					</div>
					<div className="input-type">
						<p>Número da conta</p>
						<select
						id='type'
						{...register("type", { required: true })}
						>
							<option value="conta corrente">Conta Corrente</option>
							<option value="conta popança">Conta Corrente</option>
						</select>
						{errors.type?.message && <p>{String(errors.type.message)}</p>}
					</div>
					<button type="submit">Cadastrar</button>
				</form>
			</div>
		</>
	)
}