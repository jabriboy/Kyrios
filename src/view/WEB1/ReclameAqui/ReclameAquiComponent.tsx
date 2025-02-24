import { useForm } from "react-hook-form";
import ReclameAquiDB from "../../../control/ReclameAquiDB";
import { User } from "firebase/auth";

export default function ReclameAquiComponent(props: {currentUser: User | null}){
	interface FormData {message: string}

	const { handleSubmit, register, reset } = useForm<FormData>();
	const { postMessage } = ReclameAquiDB()

	const onSubmit = async (data: FormData) => {
		// console.log('Login Data:', data)
		await postMessage({
				UserId: props.currentUser?.uid || "", 
				message: data.message, 
				date: "hoje"
			})
		
		reset();

    	// Exibir mensagem de sucesso
    	alert("Mensagem enviada com sucesso!");
	}
	
	return(
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="message">
					<h3>Não encontrou sua dúvida ou está tendo algum problema? Fale Conosco!</h3>
					<textarea
						{...register("message", { required: true })}
						id="message"
						rows={5} // Número de linhas visíveis
						cols={50} // Largura do textarea
						placeholder="Digite aqui..."
						style={{ resize: "none" }} // Permite redimensionar somente na vertical
					/>
				</div>

				<button type="submit">enviar</button>
			</form>
		</>
	)
}