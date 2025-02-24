import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/kyrios type.png'
import './PlanosStyle.css'
import { useEffect, useState } from 'react';
import { auth } from '../../../model/firebaseConfig';
import { User } from 'firebase/auth';
import Plano from '../../../model/interfaces/Plano';
import PlanoDB from '../../../control/PlanoDB';
import Loading from '../Loading/Loading';

export default function Planos(){
	const { getPlano } = PlanoDB()

	const navigate = useNavigate()

	const [plans, setPlans] = useState<{id: string, p: Plano}[] | null>(null)
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [duration, setDuration] = useState("/mês");

	const styleDurationSelected = {
		background: "white",
		color: "blue",
		transition: '.3s'
	}

	useEffect(() => {
		// Observar o estado de autenticação do usuário
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setCurrentUser(user); // Atualiza o estado do usuário
			setLoading(false); // Finaliza o estado de carregamento

			setPlans(await getPlano())
			// console.log(await getPlano())
		});

		// Cleanup do observer
		return () => unsubscribe();
	}, [getPlano]);

	// Renderiza um estado de carregamento enquanto o auth não é resolvido
	if (loading) {
		return <Loading/>;
	}
	return (
		<>
			<div className="planos">
				<header>
					<div className="img">
						<p>Boas-Vindas ao</p>
						<div className="logo">
							<img src={logo} alt="logo kyrios" />
							<p>.PRO</p>
						</div>
					</div>
					<button onClick={() => {
						navigate('/')
					}}>voltar</button>
				</header>
			
				<ul className='switch-duration'>
					<li onClick={() => {
						setDuration("/mês")
					}} style={duration == "/mês" ? styleDurationSelected : {}}>mensal</li>
					<li onClick={() => {
						setDuration("/semestre")
					}} style={duration == "/semestre" ? styleDurationSelected : {}}>semestral</li>
					<li onClick={() => {
						setDuration("/ano")
					}} style={duration == "/ano" ? styleDurationSelected : {}}>anual</li>
				</ul>
				<div className="plan">
					<div className="pro">
						<h2>KYRIOS.PRO</h2>
						<ul className='benefícios'>
							<li>com <span>kyrios.pro</span> você pode criar até 3 livros caixa</li>
							<li><span>kyrios.pro</span> possui cadastro ilimitado de diferentes bancos</li>
						</ul>
						{plans?.map((p) => {
							// console.log(p.p)
							if(p.p.desc.includes('premium')){
								if(p.p.duration == duration)
								return(
									<>
										<p className='price'>
											R${p.p.price}{p.p.duration}
										</p>
										<a  className='btn-subscribe'
											href={
												currentUser
													? p.p.link + "?prefilled_email=" + currentUser.email
													: "#"
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											Assinar Agora
										</a>
									</>
								)
							}
						})}
					</div>
					<div className="pro">
						<h2>KYRIOS.PRO</h2>
						<p className='diamond'>Diamond</p>
						<ul className='benefícios'>
							<li>com o <span>diamond</span> você cria quantos livros caixa quiser</li>
							<li>com o <span>diamond</span> você pode fazer o upload do seu extrato bancário</li>
							<li>cadastre quantas empresas quiser com o  <span>diamond</span></li>
						</ul>
						{plans?.map((p) => {
							// console.log(p.p)
							if(p.p.desc.includes('diamond')){
								if(p.p.duration == duration)
									return(
										<>
											<p className='price'>
												R${p.p.price}{p.p.duration}
											</p>
											<a  className='btn-subscribe'
												href={
													currentUser
														? p.p.link + "?prefilled_email=" + currentUser.email
														: "#"
												}
												target="_blank"
												rel="noopener noreferrer"
											>
												Assinar Agora
											</a>
										</>
									)
							}
						})}
					</div>
				</div>
			</div>
		</>
	)
}