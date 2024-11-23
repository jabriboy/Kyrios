import { auth } from "../model/firebaseConfig";
import UserDB from "./UserDB";

// Criando uma conexão SSE com o servidor
const StripeBackEnd = () => {
	const eventSource = new EventSource('http://localhost:3000/events');
	
	// Escutando os eventos enviados pelo backend
	eventSource.onmessage = async function(event) {
		const eventData = JSON.parse(event.data);

		const { changeStatus, addCusID, changePriceId } = UserDB()
		
		console.log('Evento recebido:', eventData.eventType);
		
		// Aqui você pode manipular os dados como quiser
		// Exemplo: Exibir no frontend
		if (eventData.eventType === 'payment_intent.succeeded') {
			// const data = eventData.eventData
			// console.log(Pagamento bem-sucedido: ${JSON.stringify(data)});

			const userid = auth.currentUser?.uid
			// console.log(userid)
			// buscar user com esse id
			await changeStatus(String(userid), "active")

		} else if (eventData.eventType === 'payment_method.attached') {
			const data = eventData.eventData
			// console.log(Método de pagamento anexado: ${JSON.stringify(data)});

			const userid = auth.currentUser?.uid
			console.log("Customer: ", data.customer)
			const custumerId = data.customer

			await addCusID(String(userid), custumerId)

		} else if (eventData.eventType === 'customer.subscription.deleted') {
			// const data = eventData.eventData
			// console.log(Assinatura cancelada: ${JSON.stringify(data)});
			const userid = auth.currentUser?.uid

			await changeStatus(String(userid), "deactive")


		} else if(eventData.eventType === 'invoice.payment_succeeded') {
			const data = eventData.eventData
			// console.log(Subscription Created: ${JSON.stringify(data)});
			const priceId = data.lines.data[0].plan.id

			const userid = auth.currentUser?.uid

			await changePriceId(String(userid), priceId)

		}
	};
	
	// Tratar erros de conexão
	eventSource.onerror = function(error) {
	  console.error('Erro na conexão SSE:', error);
	};
}

export default StripeBackEnd