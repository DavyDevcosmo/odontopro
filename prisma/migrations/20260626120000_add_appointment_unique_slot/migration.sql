-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_appointmentDate_time_key" ON "Appointment"("userId", "appointmentDate", "time");
