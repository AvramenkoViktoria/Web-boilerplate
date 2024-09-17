module.exports = {
    hello: 'world',
};

import {randomUserMock, additionalUsers} from './FE4U-Lab2-mock';
import {User} from './user-interfaces';

function formatTeachersData() {
    const outputUsers = randomUserMock.map((user) => ({
        gender: user.gender,
        title: user.name.title,
        full_name: user.name.first + ' ' + user.name.last,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
        coordinates: user.location.coordinates,
        timezone: user.location.timezone,
        email: user.email,
        b_date: user.dob.date,
        age: user.dob.age,
        phone: user.phone,
        picture_large: user.picture.large,
        picture_thumbnail: user.picture.thumbnail,
    }));
    return outputUsers;
}

function createRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function signRandomCourse() {
    const courses = [
        'Mathematics',
        'Physics',
        'English',
        'Computer Science',
        'Dancing',
        'Chess',
        'Biology',
        'Chemistry',
        'Law',
        'Art',
        'Medicine',
        'Statistics',
    ];

    const randomIndex = Math.floor(Math.random() * courses.length);
    return courses[randomIndex];
}

function uniteTwoDataLists(): User[] {
    const formattedUsers: User[] = formatTeachersData() as User[];

    const unitedUsers: User[] = formattedUsers.map((user) => {
        const matchingUser = additionalUsers.find(
            (addUser) => addUser.full_name === user.full_name,
        );

        let additionalFields: Partial<User>;

        if (matchingUser) {
            additionalFields = {
                id: matchingUser.id ?? null,
                favorite: matchingUser.favorite ?? false,
                course: matchingUser.course ?? signRandomCourse(),
                bg_color: matchingUser.bg_color ?? createRandomColor(),
                note: matchingUser.note ?? null,
            };
        } else {
            additionalFields = {
                id: null,
                favorite: false,
                course: signRandomCourse(),
                bg_color: createRandomColor(),
                note: null,
            };
        }

        return {
            ...user,
            ...additionalFields,
        };

        return user;
    });

    return unitedUsers;
}

function validatePhoneNumber(phoneNumber: string, country: string): boolean {
    const regexes: {[key: string]: RegExp} = {
        Germany: /^\+49\d{10,11}$/,
        Ireland: /^\+353\d{7,10}$/,
        Australia: /^\+61\d{9,10}$/,
        'United States': /^\+1\d{10}$/,
        Finland: /^\+358\d{6,10}$/,
        Turkey: /^\+90\d{10}$/,
        Switzerland: /^\+41\d{9}$/,
        'New Zealand': /^\+64\d{8,10}$/,
        Spain: /^\+34\d{9}$/,
        Norway: /^\+47\d{8}$/,
        Denmark: /^\+45\d{8}$/,
        Iran: /^\+98\d{11}$/,
        Canada: /^\+1\d{10}$/,
        France: /^\+33\d{10}$/,
        Netherlands: /^\+31\d{10}$/,
    };

    const regex = regexes[country];
    if (regex) {
        return regex.test(phoneNumber);
    } else {
        console.error(`No regex defined for country: ${country}`);
        return false;
    }
}

function validEmailFormat(input: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+$/;
    return regex.test(input);
}

function validateProfiles() {
    const users = uniteTwoDataLists();

    const wrongProfiles: User[] = [];
    const validatedUsers = users.map((user) => {
        const fieldsToCheck = [
            user.full_name,
            user.gender,
            user.note,
            user.state,
            user.city,
            user.country,
        ];

        fieldsToCheck.forEach((field) => {
            if (
                typeof field !== 'string' ||
                !(field.charAt(0) === field.charAt(0).toUpperCase())
            ) {
                wrongProfiles.push(user);
                return;
            }
        });

        if (typeof user.age !== 'number') {
            wrongProfiles.push(user);
            return;
        }

        if (!validatePhoneNumber(user.phone, user.country)) {
            wrongProfiles.push(user);
            return;
        }

        if (!validEmailFormat(user.email)) {
            wrongProfiles.push(user);
            return;
        }
    });

    wrongProfiles.forEach((profile) => {
        console.log(profile);
    });
}

function filterUsers(users: User[], filters: Partial<User>): User[] {
    return users.filter((user) => {
        return Object.entries(filters).every(([key, filterValue]) => {
            if (filterValue === undefined || filterValue === null) return true;

            const userValue = user[key as keyof User];

            return userValue === filterValue;
        });
    });
}
