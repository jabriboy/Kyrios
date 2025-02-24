import './BarraSuperiorStyle.css'
import ajuda from '../../../../assets/question.png'
import config from '../../../../assets/setting.png'
import eye_crossed from '../../../../assets/eye-crossed.png'
import eye from '../../../../assets/eye.png'
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import EmpresaDB from '../../../../control/EmpresaDB'
import { Link } from 'react-router-dom'

export default function BarraSuperior(props: {currentUser: User | null, planoDesc: string | null, empresa: string}) {
	const [active, setActive] = useState(false)
	const [saldo, setSaldo] = useState<number | null>(null)
	const [loading, setLoading] = useState(true)

	const { getEmpresaById } = EmpresaDB()

	useEffect(() => {

		const getSaldoTotal = async () => {

			const empresa = await getEmpresaById(String(props.empresa))
			const saldo = empresa.saldo
			// console.log(saldo)
			setSaldo(saldo)

			setLoading(false)
		}

		getSaldoTotal()
		
	}, [getEmpresaById,	 props.empresa])
	
	return(
		<>
			<div className="barra-superior">
				<div className="left">
					<h2>saldo <img src={active ? eye_crossed : eye} alt="olho" onClick={() => {setActive(!active)}}/></h2>
					{loading ? "calculando..." : <p className="saldo">R$ <span>{active ? saldo?.toFixed(2).replace(".", ",") : "XXXX,XX"}</span></p>}
					
				</div>
				<div className="right">
					<ul>
						<Link to={'/configurações'}>
							<li><img src={config} alt="configuração" /></li>
						</Link>
						<Link to={'/ajuda'}>
							<li><img src={ajuda} alt="ajuda e suporte" /></li>
						</Link>
					</ul>
				</div>
			</div>
		</>
	)
}