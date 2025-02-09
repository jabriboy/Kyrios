import './BarraSuperiorStyle.css'
import ajuda from '../../../../assets/question.png'
import config from '../../../../assets/setting.png'
import user from '../../../../assets/user.png'
import eye_crossed from '../../../../assets/eye-crossed.png'
import eye from '../../../../assets/eye.png'
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import EmpresaDB from '../../../../control/EmpresaDB'

export default function BarraSuperior(props: {currentUser: User | null, planoDesc: string | null}) {
	const [active, setActive] = useState(false)
	const [saldo, setSaldo] = useState<number | null>(null)
	const [loading, setLoading] = useState(true)

	const { getEmpresa } = EmpresaDB()

	useEffect(() => {

		const getSaldoTotal = async () => {

			const empresa = await getEmpresa(String(props.currentUser?.uid))
			const saldo = empresa[0].e.saldo
			// console.log(saldo)
			setSaldo(saldo)

			setLoading(false)
		}

		getSaldoTotal()
		
	}, [getEmpresa, props.currentUser?.uid])
	
	return(
		<>
			<div className="barra-superior">
				<div className="left">
					<h2>saldo <img src={active ? eye_crossed : eye} alt="olho" onClick={() => {setActive(!active)}}/></h2>
					{loading ? "calculando..." : <p className="saldo">R$ <span>{active ? saldo?.toFixed(2).replace(".", ",") : "XXXX,XX"}</span></p>}
					
				</div>
				<div className="right">
					<ul>
						<a href="#"><li><img src={user} alt="perfil" /></li></a>
						<a href="#"><li><img src={config} alt="configuração" /></li></a>
						<a href="#"><li><img src={ajuda} alt="ajuda e suporte" /></li></a>
					</ul>
				</div>
			</div>
		</>
	)
}