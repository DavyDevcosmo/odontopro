
export function formatPhone(value: string) {
    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length >11) {
        return value.slice(0, 15);
}

const formatdValue = cleanedValue
.replace(/(\d{2})(\d)/, '($1) $2')
.replace(/(\d{5})(\d)/, '$1-$2')

return formatdValue;
}

export function extractPhoneNumber(phone: string) {
    const phoneValue = phone.replace(/[()\s-]/g, '');

    return phoneValue
}