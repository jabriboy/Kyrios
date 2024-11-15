import Item from "../model/interfaces/Item"

const ItemDB = () => {
	
	const getItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const addItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const updateItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	const removeItem = async (item: Item) => {
		try{
			console.log(item)
		} catch(e){
			console.log("Control Error: ", e)
		}
	}

	
	return{
		getItem,
		addItem,
		updateItem,
		removeItem
	}

}

export default ItemDB