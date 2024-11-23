import { useForm } from 'react-hook-form';
import AuthDB from '../../control/AuthDB';

export default function Register(){
	interface FormData {username: string, email: string, password: string, password2: string}

	const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>();
	const { registerWithEmail } = AuthDB()

	const onSubmit = async (data: FormData) => {
		console.log('Login Data:', data)
		await registerWithEmail(data.username, data.email, data.password)
	}

	return(
		<>
			<h2>Sign Up</h2>
			 <form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor='email'>Email: </label>
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
					/>
					{errors.email?.message && <p>{String(errors.email.message)}</p>}
				</div>

				<div>
					<label htmlFor='username'>Username: </label>
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
					/>
					{errors.username?.message && <p>{String(errors.username.message)}</p>}
				</div>

				<div>
					<label htmlFor='password'>Senha: </label>
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
					/>
					{errors.password?.message && <p>{String(errors.password.message)}</p>}
				</div>

				<div>
					<label htmlFor='password2'>Confirmar Senha: </label>
					<input 
					autoComplete="off"
					id='password2'
					type="password" 
					{...register('password2', { 
						required: 'Confirmação de senha é obrigatória', 
						validate: (value) => 
						  value === getValues('password') || 'As senhas não coincidem',
					  })}
					/>
					{errors.password2?.message && <p>{String(errors.password2.message)}</p>}
				</div>

				<button type="submit">Register</button>
				</form>
		</>
	)
}