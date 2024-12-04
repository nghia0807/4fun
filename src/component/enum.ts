export enum AppointmentStatus {
    CANCEL = 'CANCEL',
    MEETING = 'MEETING',
    READY = 'READY',
    ENDED = 'ENDED'
}

export const ListOfAppointmentStatus = [
    {
        label: 'In meeting',
        value: AppointmentStatus.MEETING,
        color: 'green',
    },
    {
        label: 'Ending',
        value: AppointmentStatus.ENDED,
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
