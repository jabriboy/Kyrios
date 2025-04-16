import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth"
import { auth } from "../model/firebaseConfig"
import PlanoDB from "./PlanoDB"
import UserDB from "./UserDB"

const AuthDB = () => {

	const registerWithEmail = async (username: string, email: string, password: string) => {
		const { addUser } = UserDB()
		try {
			console.log('entrou aqui')
			console.log('entrou aqui 1')
			console.log('entrou aqui 2')
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			console.log('entrou aqui 3')
			await addUser({
				UserID: userCredential.user.uid,
				StripeUserID: "",
				IdPlano: "",
				username: username,
				email: email,
				status: "active"
			})
			console.log('entrou aqui 4')
			console.log("Usuário registrado:", userCredential.user);
		} catch (error: unknown) {
			if(error instanceof Error){
				console.error("Erro ao registrar:", error.message);
			} else {
				console.error("Erro ao registrar:", error);
			}
		}
	}
	
	const loginWithEmail = async (email: string, password: string) => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
	
			console.log("Usuário logado:", userCredential.user);
			
		} catch (error: unknown) {
			if(error instanceof Error){
				console.error("Erro ao registrar:", error.message);
			} else {
				console.error("Erro ao registrar:", error);
			}
		}
	}
	
	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		const { addUser } = UserDB()
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("Usuário logado com Google:", result.user);

			await addUser({
				UserID: result.user.uid,
				StripeUserID: "",
				IdPlano: "",
				username: String(result.user.displayName),
				email: String(result.user.email),
				status: "active"
			})
	
		} catch (error: unknown) {
			if(error instanceof Error){
				console.error("Erro ao registrar:", error.message);
			} else {
				console.error("Erro ao registrar:", error);
			}
		}
	}
	
	const loginWithApple = async () => {
		const provider = new OAuthProvider("apple.com");
		const { addUser } = UserDB()
		const { getPlanoId } = PlanoDB()
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("Usuário logado com Apple:", result.user);

			await addUser({
				UserID: result.user.uid,
				StripeUserID: "",
				IdPlano: String(await getPlanoId("premium free")),
				username: "",
				email: String(result.user.email),
				status: ""
			})

		} catch (error: unknown) {
			if(error instanceof Error){
				console.error("Erro ao registrar:", error.message);
			} else {
				console.error("Erro ao registrar:", error);
			}
		}
	}

	return {
		registerWithEmail, 
		loginWithEmail, 
		loginWithGoogle, 
		loginWithApple
	}
}

export default AuthDB