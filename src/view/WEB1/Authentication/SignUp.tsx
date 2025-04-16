import { useForm } from "react-hook-form";
import AuthDB from "../../../control/AuthDB";
import { useEffect, useState } from "react";
import { auth } from "../../../model/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import Loading from "../Loading/Loading";
import './SignUpStyle.css'

export default function SignUp(){
	interface FormData {username: string, email: string, password: string, password2: string}

	const [, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>();
	const { registerWithEmail } = AuthDB()

	const onSubmit = async (data: FormData) => {
		console.log('Login Data:', data)
		await registerWithEmail(data.username, data.email, data.password)
		navigate('/cadastroEmpresa')
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if(user == null) {
				// navigate('/login')
				setLoading(false)
				return
			}
			else{
				setCurrentUser(user); // Atualiza o estado do usuário
				// setLoading(false)
				navigate('/')
			}
		});
		// Cleanup do observer
		return () => unsubscribe();
	}, [navigate]);

	if (loading) {return <Loading/>}
	return(
		<>
			<div className="cadastre-se-background">
				<div className="cadastre-se">
					<h1>Cadastre-se</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<p>e-mail</p>
							<input 
							autoComplete="off"
							type="email"
							id='email' 
							{...register('email', { 
								required: 'Email é obrigatório',
								pattern: {
									value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
									message: 'Email inválido'
								}
							})}
							placeholder="E-mail"
							/>
							{errors.email?.message && <p>{String(errors.email.message)}</p>}
						</div>

						<div>
							<p>username</p>
							<input 
							autoComplete="off"
							id='username'
							type="username" 
							{...register('username', { 
								required: 'Username é obrigatório',
								pattern: {
									value: /^[a-zA-Z0-9]/,
									message: 'Username inválido, não é permitido caracteres especiais'
								}
							})} 
							placeholder="Username"
							/>
							{errors.username?.message && <p>{String(errors.username.message)}</p>}
						</div>

						<div>
							<p>senha</p>
							<input 
							autoComplete="off"
							id='password'
							type="password" 
							{...register('password', { 
								required: 'Senha é obrigatória', 
								minLength: { 
									value: 6, 
									message: 'A senha deve ter pelo menos 6 caracteres' 
								} 
							})} 
							placeholder="Senha"
							/>
							{errors.password?.message && <p>{String(errors.password.message)}</p>}
						</div>

						<div>
							<p>confirmar senha</p>
							<input 
							autoComplete="off"
							id='password2'
							type="password" 
							{...register('password2', { 
								required: 'Confirmação de senha é obrigatória', 
								validate: (value) => 
								value === getValues('password') || 'As senhas não coincidem',
							})}
							placeholder="Confirmar Senha"
							/>
							{errors.password2?.message && <p>{String(errors.password2.message)}</p>}
						</div>

						<button type="submit">Cadastrar</button>
					</form>
				</div>
			</div>
		</>
	)
}