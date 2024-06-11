"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNip = void 0;
var validateNip = function (nip) {
    var nipRegex = /^[0-9]{10}$/;
    if (!nipRegex.test(nip)) {
        return 'Invalid NIP. It should have 10 digits.';
    }
    var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    var sum = 0;
    for (var i = 0; i < 9; i++) {
        sum += parseInt(nip[i]) * weights[i];
    }
    var controlNumber = sum % 11;
    if (controlNumber === 10) {
        return 'Invalid NIP. Control number is incorrect.';
    }
    if (controlNumber !== parseInt(nip[9])) {
        return 'Invalid NIP. Control number does not match.';
    }
    return '';
};
exports.validateNip = validateNip;
