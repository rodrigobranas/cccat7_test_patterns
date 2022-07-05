import { calculate } from "../src/InvoiceService";
import sinon from "sinon";
import axios from "axios";
import Connection from "../src/Connection";

test("Deve calcular a fatura do cartão de crédito stub", async function () {
	const getMonthStub = sinon.stub(Date.prototype, "getMonth").returns(5);
	const getFullYearStub = sinon.stub(Date.prototype, "getFullYear").returns(2022);
	const axiosStub = sinon.stub(axios, "get").returns(Promise.resolve({ data: { ["Realtime Currency Exchange Rate"]: { "5. Exchange Rate": 3 } } }))
	const connectionStub = sinon.stub(Connection.prototype, "query").returns(Promise.resolve([
		{ amount: 100, currency: "BRL"},
		{ amount: 200, currency: "USD"}
	]));
	const total = await calculate("1111 1111 1111 1111", "BRL");
	expect(total).toBe(700);
	getMonthStub.restore();
	getFullYearStub.restore();
	axiosStub.restore();
	connectionStub.restore();
});

test("Deve calcular a fatura do cartão de crédito spy", async function () {
	const clock = sinon.useFakeTimers({ now: new Date("2022-06-01T10:00:00")});
	const axiosSpy = sinon.spy(axios, "get");
	const total = await calculate("1111 1111 1111 1111", "BRL");
	expect(total).toBe(1178.87);
	expect(axiosSpy.calledWith("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=CQQH5LDUUNR74HKS")).toBe(true);
	clock.restore();
	axiosSpy.restore();
});

test.skip("Deve calcular a fatura do cartão de crédito mock", async function () {
	const clock = sinon.useFakeTimers({ now: new Date("2022-06-01T10:00:00")});
	const axiosMock = sinon.mock(axios);
	axiosMock
		.expects("get")
		.withArgs("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=CQQH5LDUUNR74HKS")
		.returns(Promise.resolve({ data: { ["Realtime Currency Exchange Rate"]: { "5. Exchange Rate": 3 } } }));
	const total = await calculate("1111 1111 1111 1111", "BRL");
	expect(total).toBe(970);
	clock.restore();
	axiosMock.verify();
	axiosMock.restore();
});
