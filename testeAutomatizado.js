/**
 * testeAutomatizado_cadastro.js
 *
 * Como rodar:
 * 1) npm install selenium-webdriver
 * 2) node testeAutomatizado_cadastro.js
 */

const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
let relatorio = [];

// ---------- CONFIGURAÇÃO ----------
const TARGET_URL = "http://localhost/testedesoftware_login/cadastro.php"; // página de cadastro
const SCREENSHOT_DIR = path.join(__dirname, "assets", "screenshots_cadastro");
const TIMEOUT_MS = 5000;
const SWEETALERT_DELAY_MS = 1000;

// Garante que a pasta de screenshots exista
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// ---------- FUNÇÃO AUXILIAR ----------
function salvarScreenshot(base64, nomeArquivo) {
	const filePath = path.join(SCREENSHOT_DIR, nomeArquivo);
	fs.writeFileSync(filePath, base64, "base64");
	return filePath;
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------- FUNÇÃO DE TESTE ----------
async function testarCadastro(nome, email, senha, descricao) {
	let driver = await new Builder().forBrowser("chrome").build();
	let status = "pass";
	let mensagem = "";

	try {
		console.log(`\nTestando: ${descricao}`);
		await driver.get(TARGET_URL);

		// Preenche nome
		await driver.wait(until.elementLocated(By.id("nome")), TIMEOUT_MS);
		await driver.findElement(By.id("nome")).sendKeys(nome);

		// Preenche email
		await driver.wait(until.elementLocated(By.id("email")), TIMEOUT_MS);
		await driver.findElement(By.id("email")).sendKeys(email);

		// Preenche senha
		await driver.wait(until.elementLocated(By.id("senha")), TIMEOUT_MS);
		await driver.findElement(By.id("senha")).sendKeys(senha);

		// Clica no botão de cadastro
		await driver.wait(until.elementLocated(By.id("btn-cadastro")), TIMEOUT_MS);
		await driver.findElement(By.id("btn-cadastro")).click();

		// Aguarda SweetAlert aparecer
		await delay(SWEETALERT_DELAY_MS);

		// Captura mensagem do SweetAlert
		const alertElement = await driver.wait(
			until.elementLocated(By.css(".swal2-popup")),
			TIMEOUT_MS
		);
		mensagem = await alertElement.getText();
		console.log("Mensagem recebida:", mensagem);

		// Tira screenshot e salva
		const safeName = descricao
			.replace(/\s+/g, "_")
			.replace(/[^a-zA-Z0-9_\-]/g, "");
		const screenshotName = `screenshot_${safeName}.png`;
		const base64 = await driver.takeScreenshot();
		const savedPath = salvarScreenshot(base64, screenshotName);
		console.log(`Screenshot salva em: ${savedPath}`);

		relatorio.push({
			teste: descricao,
			status,
			mensagem,
			screenshot: savedPath,
		});
	} catch (err) {
		status = "fail";
		console.log("Erro durante o teste:", err.message);

		// Tenta salvar screenshot de erro
		try {
			const safeName = descricao
				.replace(/\s+/g, "_")
				.replace(/[^a-zA-Z0-9_\-]/g, "");
			const screenshotName = `screenshot_erro_${safeName}.png`;
			const base64 = await driver.takeScreenshot();
			const savedPath = salvarScreenshot(base64, screenshotName);
			console.log(`Screenshot de erro salva em: ${savedPath}`);

			relatorio.push({
				teste: descricao,
				status,
				mensagem,
				screenshot: savedPath,
			});
		} catch (e) {
			console.log("Não foi possível salvar screenshot de erro:", e.message);
			relatorio.push({
				teste: descricao,
				status,
				mensagem,
				screenshot: null,
			});
		}
	} finally {
		await driver.quit();
	}
}

// ---------- ARRAY DE TESTES DE CADASTRO ----------
const testesCadastro = [
	{
		nome: "Luciano",
		email: "luciano@gmail.com",
		senha: "123qwe",
		descricao: "Cadastro realizado com sucesso"
	},
	{
		nome: "",
		email: "usuario@email.com",
		senha: "123456",
		descricao: "Campo nome não preenchido"
	},
	{
		nome: "Maria Silva",
		email: "",
		senha: "senha123",
		descricao: "Campo email não preenchido"
	},
	{
		nome: "Carlos Souza",
		email: "carlos@email.com",
		senha: "",
		descricao: "Campo senha não preenchido"
	},
];

// ---------- EXECUÇÃO SEQUENCIAL ----------
(async () => {
	if (!testsOrArrayIsValid(testesCadastro)) {
		console.log("Nenhum teste de cadastro configurado.");
		return;
	}

	for (let t of testesCadastro) {
		await testarCadastro(t.nome, t.email, t.senha, t.descricao);
	}

	// Salva relatório final em JSON
	fs.writeFileSync("relatorio_cadastro.json", JSON.stringify(relatorio, null, 2));
	console.log("\nRelatório final salvo em relatorio_cadastro.json");
})();

// ---------- FUNÇÕES AUXILIARES ----------
function testsOrArrayIsValid(arr) {
	return Array.isArray(arr) && arr.length > 0;
}
