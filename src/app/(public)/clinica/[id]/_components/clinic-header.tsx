import Image from "next/image"
import imgTest from "../../../../../../public/foto1.png"
import { MapPin } from "lucide-react"

interface ClinicHeaderProps {
  name: string | null
  image: string | null
  address: string | null
}

export function ClinicHeader({ name, image, address }: ClinicHeaderProps) {
  return (
    <section className="contianer mx-auto px-4 -mt-16">
      <div className="max-w-2xl mx-auto">
        <article className="flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-surface-card mb-8">
            <Image
              src={image ? image : imgTest}
              alt="Foto da clinica"
              className="object-cover"
              fill
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-content-primary">
            {name}
          </h1>
          <div className="flex items-center gap-1">
            <MapPin className="w-5 h-5" />
            <span>
              {address ? address : "Endereço não informado"}
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}
