import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LivroDB from "../../../control/LivroDB";
import EmpresaDB from "../../../control/EmpresaDB";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Empresa from "../../../model/interfaces/Empresa";
import './CadastroLivroStyle.css'
import Loading2 from "../Loading/Loading2";
import GoToPro from "../GoToPro/GoToPro";

export default function CadastroLivro(props: {currentUser: User | null, planoDesc: string | null, empresaId: string, setCurrentComponent: (value: string) => void, handleClick: (value: string) => void}){
	interface Livro {desc: string, IdEmpresa: string}

	const { register, handleSubmit, formState: { errors }, reset } = useForm<Livro>();
	const { addLivro, getLivro } = LivroDB()
	const { getEmpresa } = EmpresaDB()

	const navigate = useNavigate();

	const [empresa, setEmpresa] = useState<{ id: string; e: Empresa; }[] | null>(null)
	const [livro, setLivro] = useState<{id: string, l: Livro}[]>()
	const [loading, setLoading] = useState(true);

	const onSubmit = async (data: Livro) => {
		setLoading(true)
		await addLivro({
			desc: data.desc,
			IdEmpresa: data.IdEmpresa
		})
		setLoading(false)
		reset()

		navigate('/')
	};

	useEffect(() => {
		async function getData(){
			const emp = await getEmpresa(String(props.currentUser?.uid))
			setEmpresa(emp)

			const livro = await getLivro(String(props.empresaId))
			// console.log(props.empresaId)
			setLivro(livro ?? [])

		}
		getData()
		setLoading(false)

	}, [getEmpresa, getLivro, props.currentUser?.uid, props.empresaId])

	if (loading) {return <Loading2/>}
	if (!props.planoDesc?.includes("premium") && !props.planoDesc?.includes("diamond")){
		// console.log(livro?.length ?? 0)
		if((livro?.length ?? 0) >= 3){
			return <GoToPro handleClick={(value: string) => {props.setCurrentComponent(value)}} desc={"limite máximo de livros do seu plano atingido"}/>
		}
	}
	return(
		<>
			<div className="cadastro-livro">
				<h2>Cadastro Livro Caixa</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="input-empresa">
						<p>Empresa</p>
						<select 
							id="IdEmpresa"
							{...register("IdEmpresa", { required: true })}
							>
							{empresa?.map((e) => {
								// console.log(tipo)
								return (
									<option key={e.id} value={e.id}>{e.e.desc}</option>
								)
							})}
						</select>
						{errors.IdEmpresa?.message && <p>{String(errors.IdEmpresa.message)}</p>}
					</div>
					<div className="input-desc">
						<p>Nome do Livro Caixa</p>
						<input
						id='desc'
						type="text"
						{...register("desc", { required: true })}
						placeholder="Nome do Livro Caixa"
						/>
						{errors.desc?.message && <p>{String(errors.desc.message)}</p>}
					</div>
					<button type="submit">Cadastrar</button>
				</form>
			</div>
		</>
	)
}