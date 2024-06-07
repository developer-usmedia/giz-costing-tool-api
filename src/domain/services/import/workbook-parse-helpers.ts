import { Gender } from '@domain/enums/gender.enum';

export function parseGenderCell(value: string): Gender {
    switch (value) {
        case 'Men':
            return Gender.Men;
        case 'Women':
            return Gender.Women;
        default:
            return null;
    }
}

export function parseIntCell(value: string): number {
    return value === '' ? 0 : parseInt(value, 10);
}

export function parseFloatCell(value: string): number {
    return value === '' ? 0 : parseFloat(value);
}
