import Invoice from "../src/Invoice";

test("Deve testar a fatura", function () {
	const invoice = new Invoice();
	invoice.addPurchase("100", "BRL");
	invoice.addPurchase("100", "USD");
	const total = invoice.calculate({ USD: 3 }, "BRL");
	expect(total).toBe(400);
});
