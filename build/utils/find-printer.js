"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const system_receipt_printer_1 = __importDefault(require("@point-of-sale/system-receipt-printer"));
class Printer {
    get printers() {
        let printers = system_receipt_printer_1.default.getPrinters();
        return printers;
    }
    get printer() {
        return this.connectedPrinter;
    }
    set printer(printerName) {
        this.connectedPrinter = new system_receipt_printer_1.default({
            name: printerName,
        });
    }
}
exports.default = Printer;
