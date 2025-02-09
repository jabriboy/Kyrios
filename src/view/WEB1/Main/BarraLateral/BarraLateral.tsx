import { User } from "firebase/auth"
import ComponenteEmpresa from "../ComponenteEmpresa/ComponenteEmpresa"
import './BarraLateralStyle.css'
import { useState } from "react"
import home from '../../../../assets/house-window-1.png'
import swap from '../../../../assets/swap.png'
import add from '../../../../assets/add-1.png'
import balance from '../../../../assets/balance.png'
import logo from '../../../../assets/kyrios type.png'
import book from '../../../../assets/revista-de-catalogo.png'
import { useNavigate } from "react-router-dom"
// import calendar from '../../../../assets/payroll-calendar-1.png'

export default function BarraLateral(props: {currentUser: User | null, handleClick: (value: string) => void, planoDesc: string | null}) {
	const [select, setSelect] = useState('página inicial')
	
	const navigate = useNavigate();

	const styleSelect = {
		opacity: "1",
		transition: ".2s",
		fontWeight: 'bold'
	}

	const handleSelect = (value: string) => {
		props.handleClick(value)
		setSelect(value)
	}

	return(
		<>
			<div className="barra-lateral">
				<img src={logo} alt="logo kyrios" className="logo"/>

				<ComponenteEmpresa currentUser={props.currentUser} planoDesc={props.planoDesc}/>

				<ul>
					<li style={select == "página inicial" ? styleSelect : {}} onClick={() => {handleSelect("página inicial")}}><img src={home} alt="Home" /> Página Inicial </li>
					<li style={select == "cadastrar transação" ? styleSelect : {}} onClick={() => {handleSelect("cadastrar transação")}}><img src={add} alt="Cadastrar Transação" /> Cadastrar Transação </li>
					<li style={select == "cadastrar banco" ? styleSelect : {}} onClick={() => {handleSelect("cadastrar banco")}}><img src={balance} alt="Cadastrar Banco" /> Cadastrar Banco </li>
					<li style={select == "criar livro caixa" ? styleSelect : {}} onClick={() => {handleSelect("criar livro caixa")}}><img src={book} alt="Criar Livro Caixa" /> Criar Livro Caixa </li>
					<li style={select == "transações" ? styleSelect : {}} onClick={() => {handleSelect("transações")}}><img src={swap} alt="Transações" /> Transações </li>
					{/* <li style={select == "extrato" ? styleSelect : {}} onClick={() => {handleSelect("extrato")}}><img src={calendar} alt="Extrato" /> Extrato </li> */}
				</ul>

				<div className="btn-premium" onClick={() => {
					navigate('/planos')
				}}>
					seja premium
				</div>
			</div>
		</>
	)
}