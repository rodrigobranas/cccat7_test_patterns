import CalculateInvoice from "../src/CalculateInvoice";

test("Deve testar a invoice", async function () {
	const exchangeGatewayStub = { getExchangeRate: async () => 3 };
	const invoiceRepositoryStub = { getPurchases: async () => [ { amount: 100, currency: "BRL" }, { amount: 100, currency: "USD" }] };
	const calculateInvoice = new CalculateInvoice(exchangeGatewayStub, invoiceRepositoryStub);
	const total = await calculateInvoice.calculate("1111 1111 1111 1111", "BRL", new Date("2022-06-01T10:00:00"));
	expect(total).toBe(400);
});
