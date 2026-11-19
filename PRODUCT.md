# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary (paying): the self-employed psychologist.** Works alone, in their own office or online, and needs a schedule that patients can book on their own through a public link. They set up services, office hours, and reminders, and manage the subscription themselves. No secretary sits between them and the tool.
- **Secondary: the patient.** Gets to the clinic's public page (`/clinica/[id]`), often through the professional's link or the public listing on the landing page. Picks a service, a date, and a time, and books with name, email, and phone, without creating an account.
- Small clinics with several professionals are not the focus. The data model treats each account as a single professional (`User`) with its own services and hours.

## Product Purpose

PsicoPro lets a self-employed psychologist take online bookings and organize their schedule without depending on WhatsApp, a calendar app, or a large platform. Success means the professional sets up their services and hours, shares the link, and patients book on their own, with no back-and-forth messages to settle a time.

## Positioning

**Cheaper and simpler than the big platforms.** It is not a bloated marketplace: it gives the professional their own schedule with a booking link, at an affordable monthly price. Psychology comes first, with no door closed to other health fields later.

## Operating Context

- The professional logs in with Google or GitHub (NextAuth) and works in the panel: dashboard with appointments by day, reminders, services (name, price, duration), profile (photo, address, phone, time zone, office hours), and plans.
- The patient books on the clinic's public page, choosing a service, a day, and a free time slot. Slots that are already taken or that don't fit the service's duration are blocked.
- The landing page (`/`) lists the available professionals/clinics, with a "Premium" badge for accounts on the Professional plan.
- The professional copies their public link from the panel to share it with patients.

## Capabilities and Constraints

- Stack in place: Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui (Radix), Prisma 7 + PostgreSQL, NextAuth v5, Stripe (Checkout, Customer Portal, Webhooks), Cloudinary for photos.
- Plans: **Basic** (up to 3 services, R$ 27,90) and **Professional** (up to 50 services, R$ 97,90), both with unlimited bookings. There is a 3-day free trial (`TRIAL_DAYS`). The prices and the "de/por" (was/now) reference prices live in `src/utils/plans/index.ts`.
- Terminology in the code: "clínica" for the professional's public page, "serviço" for the type of session, "agendamento", "lembrete".
- Product language: Brazilian Portuguese; amounts in BRL.
- Open question: whether the product will widen beyond psychology. The current landing copy talks about "profissionais da saúde" in general, and `public/logo-odonto.png` is a leftover that doesn't match the focus.

## Brand Commitments

- Name: **PsicoPro**.
- No logo, voice, or visual identity was confirmed in this conversation.

## Evidence on Hand

- `public/doctor-hero.png` (generic illustrative image in the hero) and `public/foto1.png` (fallback photo for clinics without an image). Both are placeholders, not real assets.
- `public/logo-odonto.png`: leftover asset, not the PsicoPro brand.
- There are **no** testimonials, real customers, usage numbers, press, or case studies. Future work must not invent any of these.

## Product Principles

1. **Simplicity beats breadth.** Each new feature has to justify its weight against the "simpler than the big platforms" promise.
2. **Booking with no friction for the patient.** No account, the fewest fields possible, clear slots.
3. **The professional is in control.** Their own link, their own hours, their own services, with no marketplace in between.
4. **Psychology first.** Language and flows assume the psychologist's routine, without hard-coding things that would stop other health fields from using it later.
5. **Accessible price, honestly presented.** Plans and limits stay clear, and nothing promised goes beyond what the product delivers.
