// import { useNavigate } from 'react-router-dom'
// import logo from '../../../assets/kyrios type.png'
import './PlanosStyle.css'
import { useEffect, useState } from 'react';
import { auth } from '../../../model/firebaseConfig';
import { User } from 'firebase/auth';

export const plans = [
	{
		link: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_bIY7uQfyndrm1G0288" : "",
		piceId: process.env.NODE_ENV === "development" ? "price_1QbpXSGTtKzbYqtT8wMAdTl1" : "",
		price: 99.99,
		duration: "/month",
	},
];

export default function Planos(){
	// const navigate = useNavigate()

	const [plan] = useState(plans[0]);

	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Observar o estado de autenticação do usuário
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user); // Atualiza o estado do usuário
			setLoading(false); // Finaliza o estado de carregamento
		});

		// Cleanup do observer
		return () => unsubscribe();
	}, []);

	// Renderiza um estado de carregamento enquanto o auth não é resolvido
	if (loading) {
		return <div className="loading">Loading...</div>;
	}
	return (
		<>
			<div className="pricing">
				<div className="plan">
					<h2>Plano Premium</h2>
					<p>plano premium</p>
					<p>
						valor: {plan.price}
						{plan.duration}
					</p>
					<a
						href={
							currentUser
								? plan.link + "?prefilled_email=" + currentUser.email
								: "#"
						}
						target="_blank"
						rel="noopener noreferrer"
					>
						Subscribe
					</a>
				</div>
				
				<a href={
					currentUser ?
					"http://billing.stripe.com/p/login/test_bIY9DO2PudvS79CfYY" + "?prefilled_email=" + currentUser.email : ""
				} target="_blank"
				rel="noopener noreferrer"> portal do cliente</a>
			</div>
		</>

	// return(
	// 	<>
	// 		<div className="planos">
	// 			<div className="header">
	// 				<img src={logo} alt="logo kyrios" />
	// 				<p onClick={() => {
	// 					navigate('/')
	// 				}}>voltar</p>
	// 			</div>
	// 			<h1>Planos Kyrios</h1>
	// 			<div className="pricing-table">
	// 				<stripe-pricing-table 
	// 					pricing-table-id="prctbl_1QbprHGTtKzbYqtTdcHKxzgs"
	// 					publishable-key="pk_test_51Qbo2qGTtKzbYqtTcxIwzb368ZLbGXxgzAEPtnj4rbBBwlWatjR7yF39QaK3DEF1hUUkkjCA0bIWRH5h2qbzLinu00CRI3JwkG"
	// 					rel="noopener noreferrer"
	// 				>
	// 				</stripe-pricing-table>
	// 			</div>
	// 		</div>
	// 	</>
	)
}