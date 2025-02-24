import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BancoDB from "../../../control/BancoDB";
import Loading2 from "../Loading/Loading2";
import { User } from "firebase/auth";
import './CadastroBancoStyle.css'
import Banco from "../../../model/interfaces/Banco";
import GoToPro from "../GoToPro/GoToPro";

export default function CadastroBanco(props: {currentUser: User | null, planoDesc: string | null, empresa: string, loading: Dispatch<SetStateAction<string>> | null, setCurrentComponent: (value: string) => void, handleClick: (value: string) => void}){
	interface cadBanco {nameBanco: string, numConta: string, type: string}
	
	const { register, handleSubmit, formState: { errors }, reset } = useForm<cadBanco>();
	const { addBanco, getBancosValidos, getBanco } = BancoDB()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(true);
	const [banc, setBanc] = useState<{ id: string; b: Banco; }[] | null>(null);
	const [bancos, setBancos] = useState<{ id: string; b: { desc: string; }; }[] | undefined>(undefined)

	const onSubmit = async (data: cadBanco) => {
		setLoading(true)
		await addBanco({
			IdUser: String(props.currentUser?.uid),
			IdEmpresa: props.empresa,
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

			const bancos = await getBanco(String(props.currentUser?.uid), String(props.empresa))
			setBanc(bancos)
		}

		getData()
		setLoading(false)

	}, [getBanco, getBancosValidos, props.currentUser, props.empresa])

	if (loading) {return <Loading2/>}
	if ((!props.planoDesc?.includes("premium") && !props.planoDesc?.includes("diamond"))){
		if((banc?.length ?? 0) > 0){
			return <GoToPro handleClick={(value: string) => {props.setCurrentComponent(value)}} desc={"limite máximo de bancos cadastrados para o plano atual"}/>
		}
		else{
			if(props.loading) props.loading("none")
		}
	}
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
							<option value="conta poupança">Conta Poupança</option>
						</select>
						{errors.type?.message && <p>{String(errors.type.message)}</p>}
					</div>
					<button type="submit">Cadastrar</button>
				</form>
			</div>
		</>
	)
}