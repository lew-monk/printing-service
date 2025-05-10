import express from "express";
import { errorHandler } from "./middlewares/errorHander";
import Printer from "./utils/find-printer";
// @ts-ignore
import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import sharp from "sharp";
import Logo from "./assets/logo";

const imageBuffer = Buffer.from(Logo);

const app = express();

const encoder = new ReceiptPrinterEncoder({
	feedBeforeCut: 4,
});

app.use(express.json());

app.get("/health-check", (req, res) => {
	res.send("This app is running!");
});

app.get("/get-printers", (req, res) => {
	let printer = new Printer();
	let printers = printer.printers;
	res.status(200).json({ ...printers });
});

app.post("/", async (req, res) => {
	let ticketDetails = req.body;
	let customPrinter = new Printer();

	let shopName = ticketDetails.ticketDetails.shopName;
	let ticketResponse = ticketDetails.ticketDetails.ticketResponse;

	customPrinter.printer = customPrinter.printers[0].name ?? "BIXOLON_SRP_E300";

	const NPS_URL = "https://eflow-nps.safaricom.co.ke/";

	let buffer = await sharp(imageBuffer)
		.raw()
		.toBuffer({ resolveWithObject: true });
	try {
		let result = encoder
			.initialize()
			.align("center")
			.font("B")
			.image(buffer, 240, 48)
			.align("center")
			.line("Karibu")
			.align("center")
			.line(shopName)
			.rule({ style: "double" })
			.line(
				`Date: ${new Date().toLocaleDateString()} \n Arrival Time: ${new Date().toLocaleTimeString()}`,
			)
			.rule({ style: "double" })
			.align("center")
			.line("Ticket Number")
			.align("center")
			.size(3, 3)
			.bold()
			.line(ticketResponse["ticket_number"])
			.align("center")
			.bold(false)
			.size(1, 1)
			.newline()
			.line("For self service, please dial")
			.line("*100# or *200#, or *544#")
			.align("center")
			.font("B")
			.newline()
			.line("Thank you for visiting  us")
			.line("Scan the QR code to provide feedback")
			.qrcode(
				`${NPS_URL}?shopName=${ticketDetails.shopName}&sid=${ticketResponse.shop_id}&shopType=retail`,
			)
			.cut()
			.encode();
		// @ts-ignore
		customPrinter.printer.print(result);
		// @ts-ignore
		await customPrinter.printer.addEventListener("connected", (device: any) => {
			// @ts-ignore
			customPrinter.printer.print(result);
		});
	} catch (error) {
		throw error;
	}

	res.status(200).json({ message: ticketDetails });
});

app.use(errorHandler);

export default app;
