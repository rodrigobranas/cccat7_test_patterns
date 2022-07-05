import ExchangeGateway from "./ExchangeGateway";
import Invoice from "./Invoice";
import InvoiceRepository from "./InvoiceRepository";

export default class CalculateInvoice {

	constructor (readonly exchangeGateway: ExchangeGateway, readonly invoiceRepository: InvoiceRepository) {
	}

	async calculate (cardNumber: string, invoiceCurrency: string, today: Date) {
		const month = today.getMonth();
		const year = today.getFullYear();
		const purchases = await this.invoiceRepository.getPurchases(cardNumber, month, year);
		const currencies: any[] = [...new Set(purchases.map((purchase: { currency: string }) => purchase.currency))].filter((currency) => currency !== invoiceCurrency);
		const exchange: {[currency: string]: number} = {};
		for (const currency of currencies) {
			const rate = await this.exchangeGateway.getExchangeRate(currency, invoiceCurrency);
			exchange[currency] = parseFloat(rate);
		}
		const invoice = new Invoice();
		for (const purchase of purchases) {
			invoice.addPurchase(purchase.amount, purchase.currency);
		}
		return invoice.calculate(exchange, invoiceCurrency);
	}
}

	