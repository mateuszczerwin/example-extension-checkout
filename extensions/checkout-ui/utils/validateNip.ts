export const validateNip = (nip: string, translations: Record<string, string>) => {

    const nipRegex = /^[0-9]{10}$/;

    if (!nipRegex.test(nip)) {
        return translations.nipInvalidLength;
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const sum = weights.reduce((acc, weight, index) => acc + weight * parseInt(nip[index]), 0);

    const controlNumber = sum % 11;

    if (controlNumber === 10) {
        return translations.nipInvalidControlNumber;
    }

    if (controlNumber !== parseInt(nip[9])) {
        return translations.nipControlNumberMismatch;
    }

    return '';
};
