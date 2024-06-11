export const validateNip = (nip: string, translations: { [key: string]: string }) => {

    const nipRegex = /^[0-9]{10}$/;

    if (!nipRegex.test(nip)) {
        return translations.nipInvalidLength;
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(nip[i]) * weights[i];
    }

    const controlNumber = sum % 11;

    if (controlNumber === 10) {
        return translations.nipInvalidControlNumber;
    }

    if (controlNumber !== parseInt(nip[9])) {
        return translations.nipControlNumberMismatch;
    }

    return '';
};
