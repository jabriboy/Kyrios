import { useForm } from "react-hook-form";
import EmpresaDB from "../../../control/EmpresaDB";
import { useEffect, useState } from "react";
import { auth } from "../../../model/firebaseConfig";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import './CadastroEmpresaStyle.css'

export default function CadastroEmpresa() {
	interface Cadastro {desc: string, area: string}

	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const { addEmpresa } = EmpresaDB()

	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm<Cadastro>();

	const onSubmit = async (data: Cadastro) => {
		// console.log('Login Data:', data)
		await addEmpresa({
			IdUser: String(currentUser?.uid),
			desc: data.desc,
			area: data.area,
			saldo: 0
		})

		navigate('/')
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if(user == null) {
				navigate('/login')
				return
			}
			else{
				setCurrentUser(user); // Atualiza o estado do usuário
				setLoading(false)
			}
		});
		// Cleanup do observer
		return () => unsubscribe();
	}, [navigate]);

	if (loading) {return <Loading/>}
	return(
		<>
			<div className="cadastro">
				<div className="left-cadastro">
					<div className="box-cadastro">
						<h1>Cadastro de empresa</h1>
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
							<button type="submit">Cadastrar</button>
						</form>
					</div>
				</div>
				<div className="right-cadastro">
					<div className="box-right-cadastro">
						<h1>Que legal!</h1>
						<h2>Seu cadastro está quase pronto</h2>
						<p>só preciso saber o nome da sua empresa e sua área de atuação</p>
					</div>
				</div>
			</div>
		</>
	)
}