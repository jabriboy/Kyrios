import Tipo from "../model/interfaces/Tipo"

const tipoDB = () => {
	
	const getTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeTipo = async (tipo: Tipo) => {
		try{
			console.log(tipo)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getTipo,
		addTipo,
		updateTipo,
		removeTipo
	}

}

export default tipoDB