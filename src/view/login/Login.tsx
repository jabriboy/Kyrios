import { useForm } from 'react-hook-form';
import AuthDB from '../../control/AuthDB';

export default function Login(){
	interface Login {email: string, password: string}

	const { loginWithEmail, loginWithGoogle } = AuthDB()
	const { register, handleSubmit, formState: { errors } } = useForm<Login>();

	const onSubmit = async (data: Login) => {
		console.log('Login Data:', data)
		await loginWithEmail(data.email, data.password)
	};

	return(
		<>
			 <form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor='email'>Email: </label>
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
					/>
					{errors.email?.message && <p>{String(errors.email.message)}</p>}
				</div>

				<div>
					<label htmlFor='password'>Senha: </label>
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
					/>
					{errors.password?.message && <p>{String(errors.password.message)}</p>}
				</div>

				<button type="submit">Login</button>
				</form>
				<button onClick={async () => {
					await loginWithGoogle()
				}}>Google</button>
				{/* <button onClick={async () => {
					await loginWithApple()
				}}>Apple</button> */}
		</>
	)
}