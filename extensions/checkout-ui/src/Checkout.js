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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var checkout_1 = require("@shopify/ui-extensions-react/checkout");
var validateNip_1 = require("../utils/validateNip");
exports.default = (0, checkout_1.reactExtension)('purchase.checkout.delivery-address.render-before', function () { return (0, jsx_runtime_1.jsx)(Extension, {}); });
function Extension() {
    var _this = this;
    var applyMetafieldChange = (0, checkout_1.useApplyMetafieldsChange)();
    var metafields = (0, checkout_1.useMetafields)();
    var _a = (0, react_1.useState)(false), isBusiness = _a[0], setIsBusiness = _a[1];
    var _b = (0, react_1.useState)(''), companyName = _b[0], setCompanyName = _b[1];
    var _c = (0, react_1.useState)(''), nip = _c[0], setNip = _c[1];
    var _d = (0, react_1.useState)(''), nipError = _d[0], setNipError = _d[1];
    (0, react_1.useEffect)(function () {
        var loadMetafiles = function () {
            var customerType = metafields.find(function (field) { return field.namespace === 'custom' && field.key === 'customer_type'; });
            var companyNameField = metafields.find(function (field) { return field.namespace === 'custom' && field.key === 'company_name'; });
            var nipField = metafields.find(function (field) { return field.namespace === 'custom' && field.key === 'nip'; });
            if ((customerType === null || customerType === void 0 ? void 0 : customerType.value) === 'business') {
                setIsBusiness(true);
            }
            if (companyNameField) {
                setCompanyName(String(companyNameField.value));
            }
            if (nipField) {
                var nipValue = String(nipField.value);
                setNip(nipValue);
                var error = (0, validateNip_1.validateNip)(nipValue);
                setNipError(error);
            }
        };
        if (metafields.length > 0) {
            loadMetafiles();
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (nip) {
            var error = (0, validateNip_1.validateNip)(nip);
            setNipError(error);
        }
        else {
            setNipError('');
        }
    }, [nip]);
    var submitAdditionalInfo = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var metaFieldsToUpdate, _i, metaFieldsToUpdate_1, metafield;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBusiness)
                        return [2 /*return*/];
                    metaFieldsToUpdate = [
                        {
                            namespace: 'custom',
                            key: 'customer_type',
                            valueType: 'string',
                            value: 'business',
                        },
                        companyName && {
                            namespace: 'custom',
                            key: 'company_name',
                            valueType: 'string',
                            value: companyName,
                        },
                        !nipError && nip && {
                            namespace: 'custom',
                            key: 'nip',
                            valueType: 'string',
                            value: nip,
                        },
                    ].filter(Boolean);
                    _i = 0, metaFieldsToUpdate_1 = metaFieldsToUpdate;
                    _a.label = 1;
                case 1:
                    if (!(_i < metaFieldsToUpdate_1.length)) return [3 /*break*/, 4];
                    metafield = metaFieldsToUpdate_1[_i];
                    return [4 /*yield*/, applyMetafieldChange({
                            type: 'updateMetafield',
                            namespace: metafield.namespace,
                            key: metafield.key,
                            valueType: metafield.valueType,
                            value: metafield.value,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isBusiness, companyName, nip, nipError, applyMetafieldChange]);
    (0, react_1.useEffect)(function () {
        submitAdditionalInfo().then(function (r) { });
    }, [isBusiness, companyName, nip, nipError]);
    return ((0, jsx_runtime_1.jsxs)(checkout_1.BlockStack, { spacing: "loose", children: [(0, jsx_runtime_1.jsxs)(checkout_1.InlineStack, { children: [(0, jsx_runtime_1.jsx)(checkout_1.Checkbox, { checked: !isBusiness, onChange: function () { return setIsBusiness(false); }, children: "Individual" }), (0, jsx_runtime_1.jsx)(checkout_1.Checkbox, { checked: isBusiness, onChange: function () { return setIsBusiness(true); }, children: "Business" })] }), isBusiness && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(checkout_1.TextField, { label: "Company Name", value: companyName, onChange: setCompanyName }), (0, jsx_runtime_1.jsx)(checkout_1.TextField, { label: "NIP", value: nip, onChange: setNip, error: nipError }), nipError && (0, jsx_runtime_1.jsx)(checkout_1.Banner, { status: "critical", children: nipError })] }))] }));
}
