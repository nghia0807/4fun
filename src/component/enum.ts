export enum AppointmentStatus {
    CANCEL = 'CANCEL',
    READY = 'READY',
    ENDING = 'ENDING'
}

export const ListOfAppointmentStatus = [
    {
        label: 'Ending',
        value: AppointmentStatus.ENDING,
        color: 'red'
    },
    {
        label: 'Canceled Appointment',
        value: AppointmentStatus.CANCEL,
        color: 'blue'
    },
    {
        label: 'Ready',
        value: AppointmentStatus.READY,
        color: 'yellow'
    },

]