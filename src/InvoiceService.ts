import axios from "axios";
import Connection from "./Connection";

// pegar o mês atual de new Date()
export async function calculate (cardNumber: string, invoiceCurrency: string) {
	const today = new Date();
	// pega o mês anterior de propósito
	const month = today.getMonth();
	const year = today.getFullYear();
	const connection = new Connection();
	const purchases = await connection.query("select * from branas.purchase where card_number = $1 and extract(month from date)::integer = $2 and extract(year from date)::integer = $3", [cardNumber, month, year]);
	const currencies: any[] = [...new Set(purchases.map((purchase: { currency: string }) => purchase.currency))].filter((currency) => currency !== invoiceCurrency);
	const exchange: {[currency: string]: number} = {};
	for (const currency of currencies) {
		const response = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=${invoiceCurrency}&apikey=CQQH5LDUUNR74HKS`);
		const exchangeDetails = response.data;
		const rate = exchangeDetails["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
		exchange[currency] = parseFloat(rate);
	}
	let total = 0;
	for (const purchase of purchases) {
		let amount = parseFloat(purchase.amount);
		if (purchase.currency !== invoiceCurrency) {
			amount = amount * exchange[purchase.currency];
		}
		total += amount;
	}
	await connection.close();
	return Math.round(total*100)/100;
}
