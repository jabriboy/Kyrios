import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth"
import { auth } from "../model/firebaseConfig"
import PlanoDB from "./PlanoDB"
import UserDB from "./UserDB"

const AuthDB = () => {

	const registerWithEmail = async (username: string, email: string, password: string) => {
		const { getPlanoId } = PlanoDB()
		const { addUser, checkUsername, checkEmail } = UserDB()
		try {
			const usernameAvailable = await checkUsername(username)
			const emailAvailable = await checkEmail(email)
			if(usernameAvailable && emailAvailable){
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				await addUser({
					UserID: userCredential.user.uid,
					StripeUserID: "",
					IdPlano: String(await getPlanoId("free")),
					username: username,
					email: email,
					status: ""
				})
				console.log("Usuário registrado:", userCredential.user);
			}else{
				throw new Error("O nome de usuário já existe ou email já cadastrado");
			}
	
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
		const { getPlanoId } = PlanoDB()
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("Usuário logado com Google:", result.user);

			await addUser({
				UserID: result.user.uid,
				StripeUserID: "",
				IdPlano: String(await getPlanoId("free")),
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
				IdPlano: String(await getPlanoId("free")),
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