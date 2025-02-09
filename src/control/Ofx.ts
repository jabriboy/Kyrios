import ofxParser from 'node-ofx-parser';

const Ofx = () => {
	interface OFX {OFX: {BANKMSGSRSV1: {STMTTRNRS: {STMTRS: {BANKTRANLIST: {STMTTRN: [{MEMO: string, CHECKNUM: string,DTPOSTED: string, FITID: string, REFNUM: string, TRNAMT: string, TRNTYPE: string,}]}}}}}}

	const updateOfxFileOrCsv = async (file: File, bankName: string): Promise<{json: OFX | unknown, file: string} | undefined> => {
	  	const type = file.name.split('.').pop();
		if (type === 'ofx') {
			try {
				const json = await parseOfxToJson(file);
				// console.log("OFX to JSON gerado:", json);
				return {json: json, file: 'ofx'}
			} catch (error) {
				console.error("Erro ao fazer o parse do OFX:", error);
			}
		} else if (type === 'csv') {
			console.log("entrou csv")
			try {
				const json = await parseCsvToJson(file, bankName);
				// console.log("CSV to JSON gerado:", json);
				return {json: json, file: bankName.toLowerCase()}
			} catch (error) {
				console.error("Erro ao fazer o parse do CSV:", error);
			}
		}

		return {json: undefined, file: ""}
	};
  
	const parseOfxToJson = async (file: File) => {
		try {
			if (!file) return;

			return new Promise((resolve, reject) => {

				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target?.result as string;
					try {
						const parsedData = ofxParser.parse(content);
						// console.log("data:", parsedData);
						resolve(parsedData) 
	
					} catch (error) {
						console.error('Erro ao analisar o arquivo OFX:', error);
						reject(false)
					}
				};
				reader.readAsText(file);
			})

		} catch (error) {
		  	console.error('Erro ao converter OFX:', error);
		}

	};
	
	const parseCsvToJson = async (file: File, bankName: string) => {
		// passar para o banco correto
		console.log(bankName)
		if(bankName.toLowerCase() == 'banco inter'){
			console.log("entrou inter")
			return await parseInterCsvToJson(file)
		} else if(bankName.toLowerCase() == 'nubank'){
			return await parseNuBankCsvToJson(file)
		} else if(bankName.toLowerCase() == 'santander'){
			return await parseSantanderToJson(file)
		}
		else{
			console.log("banco não encontrado")
			return false
		}
	}
	  
  
	const parseInterCsvToJson = async (file: File): Promise<unknown[]> => {
		console.log(file)
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
	  
			reader.onload = (event) => {
				console.log(event)
				try {
				const text = event.target?.result as string;
		
				// Divide o texto em linhas e remove espaços desnecessários
				const rows = text.split("\n").map(row => row.trim());
				
				// Encontra o índice do cabeçalho correto
				const headerIndex = rows.findIndex(row => row.startsWith("Data Lançamento"));
				if (headerIndex === -1) {
					reject(new Error("Cabeçalho esperado não encontrado."));
					return;
				}
		
				// Pega as linhas do cabeçalho correto e do conteúdo
				const dataRows = rows.slice(headerIndex + 1).filter(row => row);
		
				// Converte as linhas em JSON com as colunas desejadas
				const json = dataRows.map(row => {
					const values = row.split(";");
					return {
					"Data Lançamento": values[0],
					"Histórico": values[1],
					"Descrição": values[2],
					"Valor": values[3],
					};
				});
				
				console.log(json)
				resolve(json); // Retorna o JSON como resultado
				} catch (error) {
				reject(error); // Rejeita a Promise em caso de erro
				}
			};
		
			reader.onerror = () => {
				reject(new Error("Erro ao ler o arquivo."));
			};
		
			reader.readAsText(file); // Lê o arquivo como texto
		});

	};

	const parseNuBankCsvToJson = async (file: File): Promise<unknown[]> => {
		return new Promise((resolve, reject) => {
		  const reader = new FileReader();
	  
		  reader.onload = (event) => {
			try {
			  const text = event.target?.result as string;
	  
			  // Divide o texto em linhas e remove espaços desnecessários
			  const rows = text.split("\n").map((row) => row.trim());
	  
			  // Encontra o índice do cabeçalho correto
			  const headerIndex = rows.findIndex((row) =>
				row.startsWith("Número;Data;Descrição;Valor")
			  );
			  if (headerIndex === -1) {
				reject(new Error("Cabeçalho esperado não encontrado."));
				return;
			  }
	  
			  // Pega as linhas do cabeçalho correto e do conteúdo
			  const dataRows = rows.slice(headerIndex + 1).filter((row) => row);
	  
			  // Converte as linhas em JSON com as colunas desejadas
			  const json = dataRows.map((row) => {
				const values = row.split(";");
				return {
				  Número: values[0]?.trim(),
				  Data: values[1]?.trim(),
				  Descrição: values[2]?.trim(),
				  Valor: values[3]?.trim(),
				};
			  });
	  
			  resolve(json); // Retorna o JSON como resultado
			} catch (error) {
			  reject(error); // Rejeita a Promise em caso de erro
			}
		  };
	  
		  reader.onerror = () => {
			reject(new Error("Erro ao ler o arquivo."));
		  };
	  
		  reader.readAsText(file); // Lê o arquivo como texto
		});
	}; 

	const parseSantanderToJson = async (file: File): Promise<unknown[]> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
		  
			reader.onload = (event) => {
			  try {
				const text = event.target?.result as string;
		  
				// Divide o texto em linhas e remove espaços desnecessários
				const rows = text.split("\n").map(row => row.trim());
		  
				// Filtra para ignorar a linha do cabeçalho real (linha de títulos) e linhas em branco
				const dataRows = rows.slice(3).filter(row => row); // Pula as primeiras 4 linhas e começa com os dados reais
		  
				// Converte as linhas para JSON
				const json = dataRows.map(row => {
				  const values = row.split(";").map(value => value.replace(/"/g, "").trim());
		  
				  return {
					Data: values[0] || null,
					Histórico: values[1] || null,
					Documento: values[2] || null,
					"Valor (R$)": values[3] || null,
				  };
				});
		  
				console.log("JSON gerado:", json); // Exibe o JSON gerado para validação
				resolve(json);
			  } catch (error) {
				reject(error); // Rejeita a Promise em caso de erro
			  }
			};
		  
			reader.onerror = () => {
			  reject(new Error("Erro ao ler o arquivo."));
			};
		  
			reader.readAsText(file); // Lê o arquivo como texto
		});				
	}
  
	return {
	  updateOfxFileOrCsv
	};
  };
  
  export default Ofx;
  