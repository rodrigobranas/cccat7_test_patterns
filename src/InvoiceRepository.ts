import Connection from "./Connection";

export default class InvoiceRepository {

	constructor () {

	}

	async getPurchases (cardNumber: string, month: number, year: number) {
		const connection = new Connection();
		const purchases = await connection.query("select * from branas.purchase where card_number = $1 and extract(month from date)::integer = $2 and extract(year from date)::integer = $3", [cardNumber, month, year]);
		await connection.close();
		return purchases;
	}
}
