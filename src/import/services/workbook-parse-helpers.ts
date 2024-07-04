import { Gender } from '@domain/entities';

export function parseGenderCell(value: string): Gender {
    switch (value) {
        case 'Men':
            return 'MEN';
        case 'Women':
            return 'WOMEN';
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
