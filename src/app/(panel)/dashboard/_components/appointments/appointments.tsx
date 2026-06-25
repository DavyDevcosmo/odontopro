import { getTimesClinic } from "../../_data-access/get-times-clinic"
import { AppointmentsList } from "./appointments-list"

export async function Appointments({ userId }: { userId: string }) {


    const { times } = await getTimesClinic({ userId: userId })
    const timesArray = Array.isArray(times) ? times as string[] : []

    return (
        <AppointmentsList times={timesArray} />
    )
}