import { useState } from "react"
import CadastroTransacao from "../CadastroTransação/CadastroTransacao"
import CadastroArquivo from "../CadastroArquivo/CadastroArquivo"
import { User } from "firebase/auth"
import './CadastroStyle.css'
import GoToPro from "../GoToPro/GoToPro"

export default function Cadastro(props: {currentUser: User | null, empresaId: string, planoDesc: string | null, setCurrentComponent: (value: string) => void, handleClick: (value: string) => void, block: boolean}){
	const [compEscolhido, setCompEscolhido] = useState<string | null>('transação')
	const [loading, setLoading] = useState('none')
	const [pro, setPro] = useState(true)

	const styleSelected = {
		backgroundColor: '#2541b2',
		fontWeight: 'bold',
		transition: '.5s'
	}

	if(props.block) return <GoToPro desc="Limite máximo de transações para o plano Gratuito" handleClick={props.handleClick}/>
	return(
		<>
			{compEscolhido === 'transação' || compEscolhido === null 
			? <CadastroTransacao setCurrentComponent={(value: string) => {props.setCurrentComponent(value)}} handleClick={(value: string) => {props.setCurrentComponent(value)}} currentUser={props.currentUser} empresaId={props.empresaId} planoDesc={props.planoDesc} loading={setLoading}/> 
			: <CadastroArquivo pro={pro} handleClick={(value: string) => {props.setCurrentComponent(value)}} currentUser={props.currentUser} empresaId={props.empresaId} planoDesc={props.planoDesc} loading={setLoading} setCurrentComponent={(value: string) => {props.setCurrentComponent(value)}}/>}

			<div className="switch" style={{display: loading}}>
				<div className="top" onClick={() => {
					setCompEscolhido('transação')
				}} style={compEscolhido == 'transação' ? styleSelected : {}}>
					Cadastrar Transação
				</div>
				<div className="barra-top" style={compEscolhido == 'transação' ? styleSelected : {}}></div>

				<div className="bottom" onClick={() => {
					// console.log(props.planoDesc)
					if(props.planoDesc?.includes("diamond")){
						console.log(props.planoDesc)
						setCompEscolhido('arquivo')
						setPro(false)
					} else{
						setCompEscolhido('arquivo')
						// console.log(pro)
						setPro(true)
					}
				}} style={compEscolhido == 'arquivo' ? styleSelected : {}}>
					Upload de Arquivo
				</div>
				<div className="barra-bottom" style={compEscolhido == 'arquivo' ? styleSelected : {}}></div>
			</div>
		</>
	)
}