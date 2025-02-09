import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Ofx from "../../../control/Ofx";
import { User } from "firebase/auth";
import BancoDB from "../../../control/BancoDB";
import Banco from "../../../model/interfaces/Banco";
import Loading2 from "../Loading/Loading2";
import './CadastroArquivoStyle.css'
import { useForm } from "react-hook-form";
import ItemDB from "../../../control/ItemDB";
import LivroDB from "../../../control/LivroDB";
import Livro from "../../../model/interfaces/Livro";
import CadastroLivro from "../CadastroLivro/CadastroLivro";
import CadastroBanco from "../CadastroBanco/CadastroBanco";

export default function CadastroArquivo(props: {currentUser: User | null, empresaId: string, planoDesc: string | null, loading: Dispatch<SetStateAction<string>>}) {
	interface CadastroArquivo {livro: string, file: File, banco: string}
	interface OFX {OFX: {BANKMSGSRSV1: {STMTTRNRS: {STMTRS: {BANKTRANLIST: {STMTTRN: [{MEMO: string, CHECKNUM: string,DTPOSTED: string, FITID: string, REFNUM: string, TRNAMT: string, TRNTYPE: string,}]}}}}}}

	const { updateOfxFileOrCsv } = Ofx()
	const { getBanco } = BancoDB()
	const { addManyByJson } = ItemDB()
	const { getLivro } = LivroDB()
	
	const { handleSubmit, formState: { errors }, setValue, register, reset } = useForm<CadastroArquivo>();
	
	const [banco, setBanco] = useState<{id: string, b: Banco}[]>()
	const [livro, setLivro] = useState<{id: string, l: Livro}[]>()
	const [files, setFiles] = useState<File>();
	const [loading, setLoading] = useState(true);
	const [, setBankName] = useState<string | null>(null);

	const hiddenFileInput = useRef<HTMLInputElement>(null);

	const onSubmit = async (data: CadastroArquivo) => {
		setBankName(data.banco)

		const jsonData: {json: OFX | unknown, file: string} | undefined = await updateOfxFileOrCsv(data.file, data.banco)
		setLoading(true)
		await addManyByJson(jsonData, data.banco, data.livro)
		setLoading(false)
		
		reset()
	}
	
	const handleClick = () => {
		if (hiddenFileInput.current) {
			hiddenFileInput.current.click();
		}
	}
	
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if(file) {
			setFiles(file)
			setValue("file", file)
		}
	}
	
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setFiles(event.dataTransfer.files[0])
		setValue('file', event.dataTransfer.files[0])
	}
	
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	}
	
	useEffect(() => {
		const getData = async () => {
			const banco = await getBanco(String(props.currentUser?.uid))
			setBanco(banco ?? [])
			
			const livro = await getLivro(String(props.empresaId))
			setLivro(livro ?? [])
			
			console.log("use effect acionou")
			setLoading(false)
			
			props.loading('block')
		}
		
		getData()
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading) {
		props.loading('none')
		return <Loading2/>
	}
	if (livro?.length == 0) {return <CadastroLivro currentUser={props.currentUser} planoDesc={props.planoDesc}/>}
	if (banco?.length == 0) {return <CadastroBanco currentUser={props.currentUser} planoDesc={props.planoDesc}/>}
	return(
		<>	
			<div className="cadastro-arquivo">
				<h2>Upload de Extrato</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
				<div className="inputLivro">
						<p>livro caixa</p>
						<select 
							id="livro"
							{...register("livro", { required: true })}
							>
						{livro?.map((l) => {
							return (
								<option key={l.id} value={l.id}>{l.l.desc}</option>
							)
						})}
						</select>

						
						{errors.livro?.message && <p>{String(errors.livro.message)}</p>}
					</div>

					<div className="inputBancoArquivo">
						<p>Selecione o Banco</p>
						<select
							id="banco"
							onChange={(value) => {
								console.log(value.target.value)
								setValue('banco',  String(value.target.value))
							}}
							
						>
							<option value=""></option>
							{banco?.map((b) => {
								return (
									<option key={b.id} value={b.id}>{b.b.nameBanco}</option>
								)
							})}
						</select>
						{errors.banco?.message && <p>{String(errors.banco.message)}</p>}
					</div>
					
					<div className="inputfile">
						<input
							type="file"
							ref={hiddenFileInput}
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
						<div className="drop-file" id="file"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onClick={handleClick}
						>	
							<p>
								Arraste o Arquivo Aqui
								(csv ou ofx)
							</p>
						</div>
						<p className="obs">
							* Não possui suporte para csv de todos os bancos *
						</p>
						<p>{files?.name}</p>
					</div>
					
					<button type="submit">Enviar</button>
				</form>
			</div>
		</>
	)
}