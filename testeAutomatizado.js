/**
 * testeAutomatizado.js
 *
 * Como rodar:
 * 1) npm install selenium-webdriver
 * 2) node testeAutomatizado.js
 */

const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
let relatorio = [];

// ---------- CONFIGURAÇÃO ----------
const TARGET_URL = "http://localhost/testedesoftware_login/login.php";
const SCREENSHOT_DIR = path.join(__dirname, "assets", "screenshots");
const TIMEOUT_MS = 5000; // tempo de espera padrão
const SWEETALERT_DELAY_MS = 1000; // delay para SweetAlert aparecer

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
async function testarLogin(email, senha, descricao) {
	let driver = await new Builder().forBrowser("chrome").build();
	let status = "pass";
	let mensagem = ""; // declarado antes do try

	try {
		console.log(`\nTestando: ${descricao}`);
		await driver.get(TARGET_URL);

		// Preenche email
		await driver.wait(until.elementLocated(By.id("email")), TIMEOUT_MS);
		await driver.findElement(By.id("email")).sendKeys(email);

		// Preenche senha
		await driver.wait(until.elementLocated(By.id("senha")), TIMEOUT_MS);
		await driver.findElement(By.id("senha")).sendKeys(senha);

		// Clica no botão de login
		await driver.wait(until.elementLocated(By.id("btn-login")), TIMEOUT_MS);
		await driver.findElement(By.id("btn-login")).click();

		// Aguarda SweetAlert aparecer
		await delay(SWEETALERT_DELAY_MS);

		// Captura mensagem do SweetAlert
		const alertElement = await driver.wait(
			until.elementLocated(By.css(".swal2-popup")), // seletor padrão SweetAlert2
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

// ---------- ARRAY DE TESTES ----------
const testes = [
	{ email: "joaogustavo2202@gmail.com", senha: "123qwe", descricao: "Login correto" },
	{ email: "joaogustavo2202@gmail.com", senha: "errada", descricao: "Senha incorreta" },
	{ email: "", senha: "1234", descricao: "Campo email vazio" },
	{ email: "joaogustavo2202@gmail.com", senha: "", descricao: "Campo senha vazio" },
	{ email: "<script>", senha: "1234", descricao: "Tentativa de XSS" },
];

// ---------- EXECUÇÃO SEQUENCIAL ----------
(async () => {
	if (!testsOrArrayIsValid(testes)) {
		console.log("Nenhum teste configurado.");
		return;
	}

	for (let t of testes) {
		await testarLogin(t.email, t.senha, t.descricao);
	}

	// Salva relatório final em JSON
	fs.writeFileSync("relatorio.json", JSON.stringify(relatorio, null, 2));
	console.log("\nRelatório final salvo em relatorio.json");
})();

// ---------- FUNÇÕES AUXILIARES ----------
function testsOrArrayIsValid(arr) {
	return Array.isArray(arr) && arr.length > 0;
}
