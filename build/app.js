"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHander_1 = require("./middlewares/errorHander");
const find_printer_1 = __importDefault(require("./utils/find-printer"));
// @ts-ignore
const receipt_printer_encoder_1 = __importDefault(require("@point-of-sale/receipt-printer-encoder"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
function extractSnapshotAsset(assetRelativePath) {
    const srcPath = path_1.default.join(__dirname, assetRelativePath);
    const tempPath = path_1.default.join(os_1.default.tmpdir(), path_1.default.basename(assetRelativePath));
    if (!fs_1.default.existsSync(tempPath)) {
        fs_1.default.copyFileSync(srcPath, tempPath);
    }
    return tempPath;
}
const app = (0, express_1.default)();
const encoder = new receipt_printer_encoder_1.default({
    feedBeforeCut: 4,
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("This app is running!");
});
app.get("/get-printers", (req, res) => {
    let printer = new find_printer_1.default();
    let printers = printer.printers;
    res.status(200).json(Object.assign({}, printers));
});
app.post("/print", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let ticketDetails = req.body;
    let customPrinter = new find_printer_1.default();
    let shopName = ticketDetails.ticketDetails.shopName;
    let ticketResponse = ticketDetails.ticketDetails.ticketResponse;
    customPrinter.printer = (_a = customPrinter.printers[0].name) !== null && _a !== void 0 ? _a : "BIXOLON_SRP_E300";
    const imagePath = extractSnapshotAsset("/assets/images/saf-logo.png");
    const NPS_URL = "https://eflow-nps.safaricom.co.ke/";
    let buffer = yield (0, sharp_1.default)(imagePath)
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
            .line(`Date: ${new Date().toLocaleDateString()} \n Arrival Time: ${new Date().toLocaleTimeString()}`)
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
            .qrcode(`${NPS_URL}?shopName=${ticketDetails.shopName}&sid=${ticketResponse.shop_id}&shopType=retail`)
            .cut()
            .encode();
        // @ts-ignore
        customPrinter.printer.print(result);
        // @ts-ignore
        yield customPrinter.printer.addEventListener("connected", (device) => {
            // @ts-ignore
            customPrinter.printer.print(result);
        });
    }
    catch (error) {
        throw error;
    }
    res.status(200).json({ message: ticketDetails });
}));
app.use(errorHander_1.errorHandler);
exports.default = app;
