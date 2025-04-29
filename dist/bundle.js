"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // build/middlewares/errorHander.js
  var require_errorHander = __commonJS({
    "build/middlewares/errorHander.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.errorHandler = void 0;
      var errorHandler = (err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).json({
          message: err.message || "Internal Server Error"
        });
      };
      exports.errorHandler = errorHandler;
    }
  });

  // build/utils/find-printer.js
  var require_find_printer = __commonJS({
    "build/utils/find-printer.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var system_receipt_printer_1 = __importDefault(__require("@point-of-sale/system-receipt-printer"));
      var Printer = class {
        get printers() {
          let printers = system_receipt_printer_1.default.getPrinters();
          return printers;
        }
        get printer() {
          return this.connectedPrinter;
        }
        set printer(printerName) {
          this.connectedPrinter = new system_receipt_printer_1.default({
            name: printerName
          });
        }
      };
      exports.default = Printer;
    }
  });

  // build/app.js
  var require_app = __commonJS({
    "build/app.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var express_1 = __importDefault(__require("express"));
      var errorHander_1 = require_errorHander();
      var find_printer_1 = __importDefault(require_find_printer());
      var receipt_printer_encoder_1 = __importDefault(__require("@point-of-sale/receipt-printer-encoder"));
      var sharp_1 = __importDefault(__require("sharp"));
      var path_1 = __importDefault(__require("path"));
      var app = (0, express_1.default)();
      var encoder = new receipt_printer_encoder_1.default({
        feedBeforeCut: 4
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
        const imagePath = path_1.default.join(__dirname, "assets", "images", "saf-logo.png");
        const NPS_URL = "https://eflow-nps.safaricom.co.ke/";
        let buffer = yield (0, sharp_1.default)(imagePath).raw().toBuffer({ resolveWithObject: true });
        try {
          let result = encoder.initialize().align("center").font("B").image(buffer, 240, 48).align("center").line("Karibu").align("center").line(shopName).rule({ style: "double" }).line(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()} 
 Arrival Time: ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`).rule({ style: "double" }).align("center").line("Ticket Number").align("center").size(3, 3).bold().line(ticketResponse["ticket_number"]).align("center").bold(false).size(1, 1).newline().line("For self service, please dial").line("*100# or *200#, or *544#").align("center").font("B").newline().line("Thank you for visiting  us").line("Scan the QR code to provide feedback").qrcode(`${NPS_URL}?shopName=${ticketDetails.shopName}&sid=${ticketDetails.ticketResponse["shop_id"]}&shopType=retail`).cut().encode();
          customPrinter.printer.print(result);
          yield customPrinter.printer.addEventListener("connected", (device) => {
            customPrinter.printer.print(result);
          });
        } catch (error) {
          throw error;
        }
        res.status(200).json({ message: ticketDetails });
      }));
      app.use(errorHander_1.errorHandler);
      exports.default = app;
    }
  });

  // build/config/config.js
  var require_config = __commonJS({
    "build/config/config.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var dotenv_1 = __importDefault(__require("dotenv"));
      dotenv_1.default.config();
      var config = {
        PORT: parseInt(process.env.PORT || "8050", 10),
        ENVIRONMENT: "development"
      };
      exports.default = config;
    }
  });

  // build/server.js
  var require_server = __commonJS({
    "build/server.js"(exports) {
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var app_1 = __importDefault(require_app());
      var config_1 = __importDefault(require_config());
      app_1.default.listen(config_1.default.PORT, () => {
        console.log(`Server running on port ${config_1.default.PORT}`);
      });
    }
  });
  require_server();
})();
