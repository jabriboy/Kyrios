import { auth } from "../model/firebaseConfig";
import UserDB from "./UserDB";

// Criando uma conexão SSE com o servidor
const StripeBackEnd = () => {
	const eventSource = new EventSource('https://sejakyrios.com.br/stripeBackend/events');
	
	// Escutando os eventos enviados pelo backend
	eventSource.onmessage = async function(event) {
		const eventData = JSON.parse(event.data);

		const { changeStatus, addCusID, changePriceId } = UserDB()
		
		// console.log('Evento recebido:', eventData.eventType);
		
		// Aqui você pode manipular os dados como quiser
		// Exemplo: Exibir no frontend
		if (eventData.eventType === 'payment_intent.succeeded') {
			const data = eventData.eventData
			// console.log(`Pagamento bem-sucedido: ${JSON.stringify(data)}`);
			
			const userid = auth.currentUser?.uid
			
			await changeStatus(String(userid), "active")
			// console.log("Customer: ", data.customer)
			await addCusID(String(userid), data.customer)

		} else if (eventData.eventType === 'payment_method.attached') {
			// const data = eventData.eventData
			// console.log(Método de pagamento anexado: ${JSON.stringify(data)});

			const userid = auth.currentUser?.uid
			console.log("uid: ", userid)

		} else if (eventData.eventType === 'customer.subscription.deleted') {
			// const data = eventData.eventData
			// console.log(Assinatura cancelada: ${JSON.stringify(data)});
			const userid = auth.currentUser?.uid
			
			await changeStatus(String(userid), "deactive")

		} else if(eventData.eventType === 'invoice.payment_succeeded') {
			const data = eventData.eventData
			// console.log(`Subscription Created: ${JSON.stringify(data)}`);
			let priceId = ""
			if(data.lines.data.length == 1) priceId = data.lines.data[0].plan.id;
			else priceId = data.lines.data[1].plan.id;
			
			const userid = auth.currentUser?.uid
			// console.log("priceId: ", priceId)
			await changePriceId(String(userid), priceId)

		} else if(eventData.eventType === 'customer.subscription.updated') {
			// const data = eventData.eventData
			// // console.log(`Subscription Updated: ${JSON.stringify(data)}`);
			// const newPriceId = data.items.data[0].plan.id
			// console.log("priceId: ", newPriceId)

			// const userid = auth.currentUser?.uid
			// await changePriceId(String(userid), newPriceId)

		}
	};
	
	// Tratar erros de conexão
	eventSource.onerror = function(error) {
	  console.error('Erro na conexão SSE:', error);
	};
}

export default StripeBackEnd