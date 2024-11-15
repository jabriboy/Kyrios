import Categoria from "../model/interfaces/Categoria"

const CategoriaDB = () => {
	
	const getCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeCategoria = async (categoria: Categoria) => {
		try{
			console.log(categoria)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getCategoria,
		addCategoria,
		updateCategoria,
		removeCategoria
	}

}

export default CategoriaDB