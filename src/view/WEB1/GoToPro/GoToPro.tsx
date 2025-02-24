import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/kyrios type.png'
import './GoToProStyle.css'

export default function GoToPro(props: {desc: string, handleClick: (value: string) => void}){
	const navigate = useNavigate();

	return(
		<>
			<div className="go-to-pro">
				<p className='props' style={{
					display: props.desc == "" ? "none" : "block"
				}}>{props.desc}</p>
				<h1>Oops... Parece que esta <br />é uma função exclusiva do</h1>
				<h1 className='logo'><img src={logo} alt="kyrios.logo" />.PRO</h1>
				<h3>Organize seu negócio sem limites agora!</h3>
				<div className="btn">
					<button className='continue-limitado' onClick={() => {
						props.handleClick('página inicial')
					}}>Continuar <br />Limitado</button>
					<button className='seja-pro' onClick={() => {navigate('/planos')}}>upgrade</button>
				</div>
			</div>
		</>
	)
}