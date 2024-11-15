import PlanoDB from "../../control/PlanoDB"
import UserDB from "../../control/UserDB"

export default function Index(){

	const { getPlano, getPlanoId, addPlano } = PlanoDB()
	const { getUser, addUser } = UserDB()

	return(
		<>
			<button onClick={async () => {
				await addPlano({
					desc: "premium",
					value: 59.90,
					expireDate: "never"
				})

				console.log("Plano: ", await getPlano())
				console.log("Plano ID: ", await getPlanoId("premium"))
				
			}}>add plano</button>
			<button onClick={async () => {
				await addUser({
					IdPlano: String(await getPlanoId("premium")),
					email: "jabri@gmail.com",
					password: "123456"
				})

				console.log("user: ", await getUser())

			}}>add user</button>
		</>
	)
}