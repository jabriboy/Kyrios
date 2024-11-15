import ItemLivro from "../model/interfaces/ItemLivro"

const ItemLivroDB = () => {
	
	const getItemLivro = async (itemLivro: ItemLivro) => {
		try{
			console.log(itemLivro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addItemLivro = async (itemLivro: ItemLivro) => {
		try{
			console.log(itemLivro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateItemLivro = async (itemLivro: ItemLivro) => {
		try{
			console.log(itemLivro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeItemLivro = async (itemLivro: ItemLivro) => {
		try{
			console.log(itemLivro)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getItemLivro,
		addItemLivro,
		updateItemLivro,
		removeItemLivro
	}

}

export default ItemLivroDB