export function isToday(date: Date) {
    const now = new Date();

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    )
}

export function isSlotInThePast(slotTime: string) {
    const [slotHour, slotMinute] = slotTime.split(":").map(Number)
    
    const now = new Date()
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (slotHour < currentHour){
        return true;
    } else if (slotHour === currentHour && slotMinute <= currentMinute) {
        return true;
    }
    return false;
}

export function isSlotSequenceAvaliable(
    startSlot: string, // Primeiro slot disponível
    requeredSlots: number, // Quantidade de slots necessários
    allSlots: string[], // Todos os slots da clínica
    blockedSlots:string[], //Horários bloqueados
) {
    const startIndex = allSlots.indexOf(startSlot)
    if (startIndex === -1 || startIndex + requeredSlots > allSlots.length) {
        return false;
    }

    for (let i = startIndex; i < startIndex + requeredSlots; i++) {
        const slotTime = allSlots[i]

        if (blockedSlots.includes(slotTime)) {
            return false;
        }
    }
    return true;
}