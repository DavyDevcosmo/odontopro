import { canPermission } from "@/utils/permissions/canPermission";
import { getAllServices } from "../_data-acess/get-all-services";
import { ServicesList } from "./services-list";
import { LabelSubscription } from "@/components/ui/labelSubscription";

interface ServicesContentProps {
    userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {

    const services = await getAllServices({ userId: userId })
    const permissions = await canPermission({ type: "service" })

    return (
        <>
            {!permissions.hasPermission && (
                <LabelSubscription expired={permissions.expired} />
            )}
            <ServicesList services={services.data || []} permission={permissions} />
        </>
    )
}