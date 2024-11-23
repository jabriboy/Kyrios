import { useState } from "react"
import { auth } from "../../model/firebaseConfig"

// eslint-disable-next-line react-refresh/only-export-components
export const plans = [
	{
		link: process.env.NODE_ENV === 'development' ? "https://buy.stripe.com/test_eVa8xMgqL7Bk7T228a" : "",
		piceId: process.env.NODE_ENV === 'development' ? "price_1QN1EZKGFMYvItWTdjsno50y" : "",
		price: 59.99,
		duration: '/month'
	},
	{
		link: process.env.NODE_ENV === 'development' ? "https://buy.stripe.com/test_dR6aFU7Uf2h0ddmbIL" : "",
		piceId: process.env.NODE_ENV === 'development' ? "price_1QNK91KGFMYvItWTOZezuGY1" : "",
		price: 599,
		duration: '/year'
	},
]

export default function Pricing(){
	const [plan] = useState(plans[0])
	const [plan2] = useState(plans[1])
	return(
		<>
			<div className="pricing">
				<div className="plan">
					<h2>Plano Premium</h2>
					<p>plano premium</p>
					<p>valor: {plan.price}{plan.duration}</p>
					<a href={
						plan.link + "?prefilled_email=" + auth.currentUser?.email || ""
					} target="_blank">subscribe</a>
				</div>
				<div className="plan2">
					<h2>Plano Premium</h2>
					<p>plano premium</p>
					<p>valor: {plan2.price}{plan2.duration}</p>
					<a href={
						plan2.link + "?prefilled_email=" + auth.currentUser?.email || ""
					} target="_blank">subscribe</a>
				</div>
			</div>
		</>
	)
}