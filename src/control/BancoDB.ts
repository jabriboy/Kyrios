import Banco from "../model/interfaces/Banco"

const BancoDB = () => {
	
	const getBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeBanco = async (banco: Banco) => {
		try{
			console.log(banco)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getBanco,
		addBanco,
		updateBanco,
		removeBanco
	}

}

export default BancoDB