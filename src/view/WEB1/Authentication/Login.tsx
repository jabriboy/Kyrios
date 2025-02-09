import { useForm } from "react-hook-form";
import AuthDB from "../../../control/AuthDB";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../../../model/firebaseConfig";
import Loading from "../Loading/Loading";
import './LoginStyle.css'
import google_icon from '../../../assets/google-icon.png'
import logo from '../../../assets/kyrios type.png'

export default function Login(){
	interface Login {email: string, password: string}

	const [, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const { loginWithEmail, loginWithGoogle } = AuthDB()
	const { register, handleSubmit, formState: { errors } } = useForm<Login>();

	const onSubmit = async (data: Login) => {
		console.log('Login Data:', data)
		await loginWithEmail(data.email, data.password)
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if(user == null) {
				navigate('/login')
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
		<div className="login-background">
			<div className="login">
				<h1>login</h1>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="inputEmail">
						{/* <label htmlFor='email'>e-mail </label> */}
						<p>e-mail</p>
						<input 
						id='email'
						type="email" 
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

					<div className="inputSenha">
						{/* <label htmlFor='password'>senha </label> */}
						<p>senha</p>
						<input 
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

					<button type="submit">entrar</button>
				</form>
				
				<div className="google">
					<p className="entrar-com-google">Entrar com Google</p>
					<button onClick={async () => {
						await loginWithGoogle()
						navigate('/cadastroEmpresa')
					}}>
						<img src={google_icon} alt="google" />
					</button>
				</div>
			</div>
			<div className="sign-up-box">
				<div className="sign-up">
					<h2>Boas-vindas ao</h2>
					<div className="kyrios">
						<img src={logo} alt="kyrios" />
					</div>
					<p>Ainda não possui conta?</p>
					<button onClick={() => {
						navigate('/signup')
					}}>Cadastre-se</button>
				</div>
			</div>
		</div>
		</>
	)
}