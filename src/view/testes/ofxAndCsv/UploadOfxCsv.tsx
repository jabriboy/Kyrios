import { useState } from "react";
import Ofx from "../../../control/Ofx";

export default function UploadOfxCsv() {
	const { updateOfxFileOrCsv } = Ofx()
	const [file, setFile] = useState<File | null>(null);
	
	const [bankName] = useState("Inter");

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Verifica se há um arquivo selecionado
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
			updateOfxFileOrCsv(event.target.files[0], bankName)
		}
	};

	return (
		<>
			<input type="file" name="file" id="file" onChange={handleFileChange} />
			<p>Banco: {bankName}</p>
			{file && <p>Arquivo selecionado: {file.name.split('.').pop()}</p>}
		</>
	);
}
