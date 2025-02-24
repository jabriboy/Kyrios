import { useEffect, useState } from "react";
import ReclameAquiComponent from "../ReclameAqui/ReclameAquiComponent";
import { User } from "firebase/auth";
import { auth } from "../../../model/firebaseConfig";
import './AjudaStyle.css'
import logo from '../../../assets/kyrios type.png'
import { useNavigate } from "react-router-dom";

export default function Ajuda(){
	const navigate = useNavigate();

	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [open, setOpen] = useState(false)
	const [ajuda, setAjuda] = useState(0)

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (u) => {
			setCurrentUser(u)

		});
		
		return () => unsubscribe();
	}, [])

	return(
		<>
			<div className="ajuda">
				<header>
					<img src={logo} alt="logo" onClick={() => {navigate('/')}}/>
					<button onClick={() => {navigate('/')}}>voltar</button>
				</header>
				<h1>Ajuda</h1>
				<div className="box-ajuda">
					<div className="left">
						<ul>
							<li onClick={() => {
								setOpen(!open)
								setAjuda(1)
							}}>
								Como usar o kyrios?
								<p style={{
									display: open && ajuda == 1 ? "block" : "none"
								}}>solução!</p>
							</li>
							<li onClick={() => {
								setOpen(!open)
								setAjuda(2)
							}}>
								Como fazer upload de extrato?
								<p style={{
									display: open && ajuda == 2 ? "block" : "none"
								}}>solução!</p>
							</li>
							<li onClick={() => {
								setOpen(!open)
								setAjuda(3)
							}}>
								Não consigo fazer upload de extrato!
								<p style={{
									display: open && ajuda == 3 ? "block" : "none"
								}}>solução!</p>
							</li>
						</ul>
					</div>
					<div className="right">
						<ReclameAquiComponent currentUser={currentUser}/>
					</div>
				</div>
			</div>
		</>
	)
}