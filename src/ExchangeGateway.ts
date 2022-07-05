import axios from "axios";

export default class ExchangeGateway {

	constructor () {
	}

	async getExchangeRate (from: string, to: string) {
		const response = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=CQQH5LDUUNR74HKS`);
		const exchangeDetails = response.data;
		return exchangeDetails["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
	}
}
