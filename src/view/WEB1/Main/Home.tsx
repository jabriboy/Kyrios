import { useEffect, useState } from "react"
import { auth } from '../../../model/firebaseConfig'
import { User } from "firebase/auth"; // Importe o tipo User do Firebase
import Loading from "../Loading/Loading";
import UserDB from "../../../control/UserDB";
import { useNavigate } from "react-router-dom";
import BarraLateral from "./BarraLateral/BarraLateral";
import BarraSuperior from "./BarraSuperior/BarraSuperior";
import './HomeStyle.css'
import EmpresaDB from "../../../control/EmpresaDB";
import PaginaInicial from "../PaginaInicial/PaginaInicial";
import Transacoes from "../Transacoes/Transacoes";
import CadastroBanco from "../CadastroBanco/CadastroBanco";
import CadastroLivro from "../CadastroLivro/CadastroLivro";

import plus from '../../../assets/add.png'
import Plano from "../../../model/interfaces/Plano";
import Cadastro from "../Cadastro/Cadastro";
import ItemDB from "../../../control/ItemDB";

export default function Home() {
	const { getPlanoByEmail } = UserDB()
	const { getEmpresa } = EmpresaDB()
	const { getLivoItemByUserId } = ItemDB()
	
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [currentComponent, setCurrentComponent] = useState('página inicial')
	const [empresa, setEmpresa] = useState<string | null>(null)
	const [plano, setPlano] = useState<Plano | null | false>(null)
	const [block, setBlock] = useState(false)

	useEffect(() => {
		// console.log(currentComponent)
		const getData = async (user: User | null) => {
			const allItems = await getLivoItemByUserId(String(user?.uid))
			let transactions = 0
			if(allItems){
				for(let i = 0; i < allItems?.length; i++){
					for(let c = 0; c < allItems[i].length; c++){
						transactions += 1
					}
				}
				if(allItems) if(transactions >= 5) setBlock(true);
			}
		}

		async function getPlano(user: User | null){
			const plano = await getPlanoByEmail(String(user?.email))
			if(plano == false) return false
			return plano
		}
		
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			// console.log("user", user?.email)
			
			if(user == null) {
				navigate('/login')
				return
			}
			await getData(user)
			const plano = await getPlano(user); // Aguarda o retorno da função getPlano
			
			if (plano === false) {
				// console.log("Plano não encontrado");
				navigate('/')
				return;
			}
			else{
				// console.log(plano)
				setPlano(plano)
				setCurrentUser(user); // Atualiza o estado do usuário
				setLoading(false); // Finaliza o estado de carregamento
			}

			const emp = await getEmpresa(String(currentUser?.uid))
			if(empresa == null) setEmpresa(emp[0]?.id)
		});
		
		return () => unsubscribe();

	}, [currentComponent, currentUser?.uid, empresa, getEmpresa, getLivoItemByUserId, getPlanoByEmail, navigate]);

	const renderComponent = () => {
		switch (currentComponent) {
			case 'página inicial':
				return <PaginaInicial currentUser={currentUser} handleClick={(value: string) => {setCurrentComponent(value)}}/>
			case 'cadastrar transação':
				return <Cadastro handleClick={(value: string) => {setCurrentComponent(value)}} currentUser={currentUser} empresaId={String(empresa)} planoDesc={plano && "desc" in plano ? plano.desc : null} setCurrentComponent={(value: string) => {setCurrentComponent(value)}} block={block}/>
			case 'cadastrar banco':
				return <CadastroBanco setCurrentComponent={(value: string) => {setCurrentComponent(value)}} handleClick={(value: string) => {setCurrentComponent(value)}} loading={null} currentUser={currentUser} planoDesc={plano && "desc" in plano ? plano.desc : null} empresa={String(empresa)}/>
			case 'transações':
				return <Transacoes currentUser={currentUser} empresaId={String(empresa)} block={block}/>
			case 'criar livro caixa':
				return <CadastroLivro setCurrentComponent={(value: string) => {setCurrentComponent(value)}} handleClick={(value: string) => {setCurrentComponent(value)}} empresaId={String(empresa)} currentUser={currentUser} planoDesc={plano && "desc" in plano ? plano.desc : null}/>
			// case 'extrato':
			// 	return <h1>extrato</h1>
			

			default:
				return <Loading/>
		}
	}

	if (loading) { return <Loading/> }
	return(
		<>	
			<div className="main">
				<BarraLateral currentUser={currentUser} handleClick={(value: string) => {setCurrentComponent(value)}} currentComponent={currentComponent} planoDesc={plano && "desc" in plano ? plano.desc : null} setEmpresa={(value: string) => {setEmpresa(value)}}/>
				<div className="right-box">
					<BarraSuperior empresa={String(empresa)} currentUser={currentUser} planoDesc={plano && "desc" in plano ? plano.desc : null}/>

					<div className="render-components">
						{renderComponent()}

						<img src={plus} alt="cadastrar transação" className="btn-add" onClick={() => {setCurrentComponent("cadastrar transação")}} />
					</div>
				</div>
			</div>

			{/* <ReclameAquiComponent currentUser={currentUser}/> */}
		</>
	)
}