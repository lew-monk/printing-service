// @ts-ignore
import SystemReceiptPrinter from "@point-of-sale/system-receipt-printer";

class Printer {
	connectedPrinter: SystemReceiptPrinter;

	get printers() {
		let printers = SystemReceiptPrinter.getPrinters();
		return printers;
	}

	get printer() {
		return this.connectedPrinter;
	}

	set printer(printerName: string) {
		this.connectedPrinter = new SystemReceiptPrinter({
			name: printerName,
		});
	}
}

export default Printer;
