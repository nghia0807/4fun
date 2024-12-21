export enum AppointmentStatus {
    CANCEL = 'CANCEL',
    READY = 'READY',
    ENDING = 'ENDING'
}

export const ListOfAppointmentStatus = [
    {
        label: 'Ended',
        value: AppointmentStatus.ENDING,
        color: 'red'
    },
    {
        label: 'Canceled',
        value: AppointmentStatus.CANCEL,
        color: 'blue'
    },
    {
        label: 'Ready',
        value: AppointmentStatus.READY,
        color: 'yellow'
    },

]