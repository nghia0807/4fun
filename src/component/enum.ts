export enum AppointmentStatus {
    CANCEL = 'CANCEL',
    MEETING = 'MEETING',
    READY = 'READY',
    ENDING = 'ENDING'
}

export const ListOfAppointmentStatus = [
    {
        label: 'In meeting',
        value: AppointmentStatus.MEETING,
        color: 'green',
    },
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