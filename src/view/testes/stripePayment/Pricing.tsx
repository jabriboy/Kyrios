/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { auth } from "../../../model/firebaseConfig";
import { User } from "firebase/auth"; // Importe o tipo User do Firebase

export const plans = [
	{
		link: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_eVa8xMgqL7Bk7T228a" : "",
		piceId: process.env.NODE_ENV === "development" ? "price_1QN1EZKGFMYvItWTdjsno50y" : "",
		price: 59.99,
		duration: "/month",
	},
	{
		link: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_dR6aFU7Uf2h0ddmbIL" : "",
		piceId: process.env.NODE_ENV === "development" ? "price_1QNK91KGFMYvItWTOZezuGY1" : "",
		price: 599,
		duration: "/year",
	},
];

export default function Pricing() {
	const [plan] = useState(plans[0]);
	const [plan2] = useState(plans[1]);

	// Estados para o usuário atual e o status de carregamento
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

	// Renderiza o conteúdo normal após o auth ser configurado
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
				<div className="plan2">
					<h2>Plano Premium</h2>
					<p>plano premium</p>
					<p>
						valor: {plan2.price}
						{plan2.duration}
					</p>
					<a
						href={
							currentUser
								? plan2.link + "?prefilled_email=" + currentUser.email
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
	);
}
