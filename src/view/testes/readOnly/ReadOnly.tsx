import { useEffect, useState } from "react";
import UserDB from "../../../control/UserDB";
import PlanoDB from "../../../control/PlanoDB";
import CategoriaDB from "../../../control/CategoriaDB";
import TipoDB from "../../../control/TipoDB";
import BancoDB from "../../../control/BancoDB";
import ItemDB from "../../../control/ItemDB";
import LivroDB from "../../../control/LivroDB";
import User from "../../../model/interfaces/User";
import Plano from "../../../model/interfaces/Plano";
import Categoria from "../../../model/interfaces/Categoria";
import Tipo from "../../../model/interfaces/Tipo";
import Banco from "../../../model/interfaces/Banco"; // Certifique-se de ter esse arquivo
import Item from "../../../model/interfaces/Item"; // Certifique-se de ter esse arquivo
import Livro from "../../../model/interfaces/Livro"; // Certifique-se de ter esse arquivo

export default function ReadOnly() {
	const { getUser } = UserDB();
	const [users, setUsers] = useState<{ id: string; u: User }[]>([]);

	const { getPlano } = PlanoDB();
	const [planos, setPlanos] = useState<{ id: string; p: Plano }[]>([]);

	const { getCategoria } = CategoriaDB();
	const [categorias, setCategorias] = useState<{ id: string; c: Categoria }[]>([]);

	const { getTipo } = TipoDB();
	const [tipos, setTipos] = useState<{ id: string; t: Tipo }[]>([]);

	const { getBanco } = BancoDB();
	const [bancos, setBancos] = useState<{ id: string; b: Banco }[]>([]);

	const { getItem } = ItemDB();
	const [items, setItems] = useState<{ id: string; i: Item }[]>([]);

	const { getLivro } = LivroDB();
	const [livros, setLivros] = useState<{ id: string; l: Livro }[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const u = await getUser();
			setUsers(u ?? []);

			const p = await getPlano();
			setPlanos(p ?? []);

			const c = await getCategoria();
			setCategorias(c ?? []);

			const t = await getTipo();
			setTipos(t ?? []);

			const b = await getBanco();
			setBancos(b ?? []);

			const i = await getItem();
			setItems(i ?? []);

			const l = await getLivro();
			setLivros(l ?? []);
		};

		fetchData();
	}, [getUser, getPlano, getCategoria, getTipo, getBanco, getItem, getLivro]);

	return (
		<>
			<h3>USERS</h3>
			{users.map((u: { id: string; u: User }) => {
				return <p key={u.u.username}>{u.u.username} - {u.u.email}</p>;
			})}

			<h3>PLANOS</h3>
			{planos.map((p: { id: string; p: Plano }) => {
				return <p key={p.p.desc}>{p.p.desc} - R${p.p.value}</p>;
			})}

			<h3>CATEGORIAS</h3>
			{categorias.map((c: { id: string; c: Categoria }) => {
				return <p key={c.c.desc}>{c.c.desc} - IdTipo: {c.c.IdTipo}</p>;
			})}

			<h3>TIPOS</h3>
			{tipos.map((t: { id: string; t: Tipo }) => {
				return <p key={t.t.desc}>id: {t.id} - {t.t.desc}</p>;
			})}

			<h3>BANCOS</h3>
			{bancos.map((b: { id: string; b: Banco }) => {
				return <p key={b.b.numConta}>id user: {b.b.IdUser} - {b.b.numConta} - {b.b.nameBanco}</p>;
			})}

			<h3>ITENS</h3>
			{items.map((i: { id: string; i: Item }) => {
				return <p key={i.id}>{i.i.desc} - Valor: R${i.i.value}</p>;
			})}

			<h3>LIVROS</h3>
			{livros.map((l: { id: string; l: Livro }) => {
				return <p key={l.id}>{l.l.desc} - id user: {l.l.IdUser}</p>;
			})}
		</>
	);
}
