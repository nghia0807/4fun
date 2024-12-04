export enum AppointmentStatus {

    READY = 'READY',
    PRESERVED = 'PRESERVED',
    MEETING = 'MEETING',
    ENDED = 'ENDED',
    CANCEL = 'CANCEL',
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
