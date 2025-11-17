

/**
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amount - O valor monetário em reais (BRL) a ser convertido.
 * @return {number} O valor convertido em centavos.
 * @example
 * convertRealToCents("39,99"); // Retorna 3999
 */
export function convertRealToCents(amount: string) {
    const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const priceInCents = Math.round(numericPrice * 100)

    console.log(numericPrice)
    return priceInCents;
}