import { useEffect, useState } from "react";
import { auth } from "../../../model/firebaseConfig";
import User from "../../../model/interfaces/User";
import UserDB from "../../../control/UserDB";
import logo from '../../../assets/kyrios type.png'
import { useNavigate } from "react-router-dom";
import './ConfiguracoesStyle.css'
import { User as User2 } from "firebase/auth";

export default function Configuracoes(){
	const { getUserById } = UserDB()

	const [currentUser, setCurrentUser] = useState<User2 | null>(null)
	const [user, setUser] = useState<User | undefined>(undefined);

	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (u) => {
			const user = await getUserById(String(u?.uid))
			setCurrentUser(u)
			setUser(user)

		});
		
		return () => unsubscribe();
	})

	return(
		<>
			<div className="config">
				<header>
					<img src={logo} alt="logo" onClick={() => {navigate('/')}}/>
					<button onClick={() => {navigate('/')}}>voltar</button>
				</header>
				<h1>Configurações e Perfil</h1>
				<div className="box">
					<div className="perfil">
						<h2>Perfil</h2>
						<p>Suas informações pessoais e configurações de segurança da conta</p>
						<div className="config-input-box">
							<p>Username: </p>
							<input type="text" name="nome-completo" id="nome-completo" placeholder={String(user?.username)}/>
						</div>

						<div className="config-input-box">
							<p>E-mail: </p>
							<input type="email" name="email" id="email" placeholder={String(user?.email)} />
						</div>
					</div>
					<div className="configuracoes">
						<h2>Configurações</h2>
						<div className="portal-do-cliente">
							<h3>Portal do Cliente</h3>
							<p>No Portal do Cliente você pode mudar seu plano, mudar a recorrência de pagamento do plano, mudar forma de pagamento e muito mais.</p>
							<a href={currentUser ?
							"https://billing.stripe.com/p/login/test_fZe9D9dqm8YU5hebII" + "?prefilled_email=" + currentUser.email : ""
							} target="_blank"
							rel="noopener noreferrer"
							className="portal-cliente"> acesse aqui</a>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}