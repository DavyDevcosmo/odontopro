"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from '@/lib/utils'
import { isSlotInThePast, isSlotSequenceAvaliable, isToday } from "./schedule-ultils";

interface ScheduleTimeListProps {
    selectedDate: Date;
    selectedTime: string;
    requiredSlots: number;
    blockedTimes: string[];
    availableTimeSlots: TimeSlot[];
    clinicTimes: string[];
    onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
    selectedDate,
    availableTimeSlots,
    blockedTimes,
    clinicTimes,
    requiredSlots,
    selectedTime,
    onSelectTime
}: ScheduleTimeListProps) {

    const dateIsToday = selectedDate ? isToday(selectedDate) : false

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {availableTimeSlots.map((slot) => {

                const sequenceOk = isSlotSequenceAvaliable(
                    slot.time,
                    requiredSlots,
                    clinicTimes,
                    blockedTimes
                )

                const slotIsPast = dateIsToday && isSlotInThePast(slot.time)

                const slotEnabled = slot.available && sequenceOk && !slotIsPast;

                return (
                    <Button
                        onClick={() => onSelectTime(slot.time)}
                        type="button"
                        variant="outline"
                        key={slot.time}
                        className={cn("h-10 select-none",
                            selectedTime === slot.time && "border-2 border-accent-primary text-content-primary bg-status-chip-confirmed-bg",
                            !slotEnabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!slotEnabled}
                    >
                        {slot.time}
                    </Button>
                )
            })}

        </div>
    )
}