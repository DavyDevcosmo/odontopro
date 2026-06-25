"use client"
import { useRouter } from "next/navigation"
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";

export function ButtonPickerAppointment() {
    const router = useRouter();

    const [selectDate, setSelectDate] = useState(format(new Date(), "yyyy-MM-dd"))

    function handleChangeDate(event: ChangeEvent<HTMLInputElement>) {
        setSelectDate(event.target.value)

        const url = new URL(window.location.href)

        url.searchParams.set("date", event.target.value)
        router.push(url.toString())
    }

    return (
        <input type="date"
            id="start"
            className="border-2 x-2 py-1 rounded-md text-sm md:text-base"
            value={selectDate}
            onChange={handleChangeDate} />
    )
}