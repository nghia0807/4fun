interface appointment {
    key: string,
    doctor: string,
    room: string,
    day: string,
    month: string,
    year: string,
    time: string,
    meet: boolean,
}

export class userData {
    constructor() {

    }

    getUserName(): string {
        return 'tam';
    }

    getName(): string {
        return 'Nguyen Duc Tam';
    }

    getAdress(): string {
        return '288/ hoang van thu';
    }

    getPhoneNumber(): string {
        return '0123456789';
    }

    getEmail(): string {
        return 'email@gmail.com';
    }

    getAppointment(): appointment[] {
        return [
            {
                key: '1',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: false
            },
            {
                key: '2',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: false
            },
            {
                key: '3',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: false
            }
        ]
    }

    getHistoryAppointment(): appointment[] {
        return [
            {
                key: '1',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: true
            },
            {
                key: '2',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: true
            },
            {
                key: '3',
                doctor: 'tam',
                room: 'a123',
                day: '1',
                month: '1',
                year: '1900',
                time: '0:00:00',
                meet: true
            }
        ]
    }


}