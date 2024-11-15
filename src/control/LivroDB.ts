import Livro from "../model/interfaces/Livro"

const LivroDB = () => {
	
	const getLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeLivro = async (livro: Livro) => {
		try{
			console.log(livro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getLivro,
		addLivro,
		updateLivro,
		removeLivro
	}

}

export default LivroDB