import { useEffect, useState } from "react"
import EmpresaDB from "../../../../control/EmpresaDB"
import { User } from "firebase/auth"
import Empresa from "../../../../model/interfaces/Empresa"
import './ComponenteEmpresaStyle.css'
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../../model/firebaseConfig"

export default function ComponenteEmpresa(props: {currentUser: User | null, planoDesc: string | null}) {
	interface Cadastro {desc: string, area: string}

	const { getEmpresa } = EmpresaDB()
	const [empresas, setEmpresas] = useState<{id: string, e: Empresa}[]>()
	const [modal, setModal] = useState(false)

	const { register, handleSubmit, formState: { errors } } = useForm<Cadastro>();

	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const { addEmpresa } = EmpresaDB()

	const navigate = useNavigate();

	useEffect(() => {
		const getData = async () => {
			const data = await getEmpresa(String(props.currentUser?.uid))
			setEmpresas(data ?? [])
		}
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if(user == null) {
				navigate('/login')
				return
			}
			else{
				setCurrentUser(user);
			}
		});

		getData()

		return () => unsubscribe();

	}, [getEmpresa, navigate, props.currentUser?.uid])

	const onSubmit = async (data: Cadastro) => {
		await addEmpresa({
			IdUser: String(currentUser?.uid),
			desc: data.desc,
			area: data.area,
			saldo: 0
		})

	};

	return(
		<>
			<div className="componente-empresa">
				<div className="empresas-box">
					<select name="empresa" id="empresa">
						{empresas?.map((e) => {
							return (
								<option key={e.id} value={e.id}>{e.e.desc}</option>
							)
						})}
					</select>
					<button onClick={() => {
						// console.log(props.planoDesc)
						if(props.planoDesc?.includes("premium") || props.planoDesc?.includes("diamond")){
							setModal(!modal)
						} 
					}}>+</button>
				</div>
				<div className="add-Empresa" style={{
					display: modal ? "block" : "none"
				}}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<p>Nome da Empresa</p>
							<input
							id='desc'
							type="text"
							{...register("desc", { required: true })}
							placeholder="Nome da Empresa"
							/>
							{errors.desc?.message && <p>{String(errors.desc.message)}</p>}
						</div>
						<div>
							<p>Área de atuação</p>
							<input
							id='area'
							type="text"
							{...register("area", { required: true })}
							placeholder="Área de Atuação"
							/>
							{errors.area?.message && <p>{String(errors.area.message)}</p>}
						</div>
						<button type="submit">Adicioar</button>
					</form>
				</div>
			</div>
		</>
	)
}