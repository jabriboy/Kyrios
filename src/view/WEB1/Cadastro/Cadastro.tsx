import { useState } from "react"
import CadastroTransacao from "../CadastroTransação/CadastroTransacao"
import CadastroArquivo from "../CadastroArquivo/CadastroArquivo"
import { User } from "firebase/auth"
import './CadastroStyle.css'

export default function Cadastro(props: {currentUser: User | null, empresaId: string, planoDesc: string | null}){
	const [compEscolhido, setCompEscolhido] = useState<string | null>('transação')
	const [loading, setLoading] = useState('none')

	const styleSelected = {
		backgroundColor: '#2541b2',
		fontWeight: 'bold',
		transition: '.5s'
	}

	return(
		<>
			{compEscolhido === 'transação' || compEscolhido === null 
			? <CadastroTransacao currentUser={props.currentUser} empresaId={props.empresaId} planoDesc={props.planoDesc} loading={setLoading}/> 
			: <CadastroArquivo currentUser={props.currentUser} empresaId={props.empresaId} planoDesc={props.planoDesc} loading={setLoading}/>}

			<div className="switch" style={{display: loading}}>
				<div className="top" onClick={() => {
					setCompEscolhido('transação')
				}} style={compEscolhido == 'transação' ? styleSelected : {}}>
					Cadastrar Transação
				</div>
				<div className="barra-top" style={compEscolhido == 'transação' ? styleSelected : {}}></div>

				<div className="bottom" onClick={() => {
					setCompEscolhido('arquivo')
				}} style={compEscolhido == 'arquivo' ? styleSelected : {}}>
					Upload de Arquivo
				</div>
				<div className="barra-bottom" style={compEscolhido == 'arquivo' ? styleSelected : {}}></div>
			</div>
		</>
	)
}