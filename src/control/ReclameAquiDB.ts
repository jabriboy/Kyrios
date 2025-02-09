import { addDoc, collection, getDocs } from "firebase/firestore"
import ReclameAqui from "../model/interfaces/ReclameAqui"
import { db } from "../model/firebaseConfig"

const ReclameAquiDB = () => {

	const getMessages = async (): Promise<{ id: string; m: ReclameAqui }[]> => {
		try{
			const querySnapshot = await getDocs(collection(db, "ReclameAqui"))
			const allmessages = querySnapshot.docs.map(doc => ({
				id: doc.id,
				m: {
					UserId: doc.data().UserID || "",
					message: doc.data().message || "",
					date: doc.data().date || ""
				}
			}));

			return allmessages || []

		} catch (e){
			console.log("Control Error: ", e)
		}

		return [{id: '', m: {UserId: '', message: '', date: ''}}]
	}

	const postMessage = async (reclameAqui: ReclameAqui): Promise<ReclameAqui> => {
		try{
			await addDoc(collection(db, "ReclameAqui"), {
				UserId: reclameAqui.UserId,
				message: reclameAqui.message,
				date: reclameAqui.date
			})

			return {UserId: reclameAqui.UserId, message: reclameAqui.message, date: reclameAqui.date}

		} catch (e){
			console.log("Control Error: ", e)
		}

		return {UserId: '', message: '', date: ''}
	}

	return {
		getMessages,
		postMessage
	}
}

export default ReclameAquiDB