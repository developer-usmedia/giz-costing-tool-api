import { Gender } from '@domain/entities';

export function parseGenderCell(value: string): Gender {
    switch (value) {
        case 'Men':         // EN
        case 'Hombres':     // ES
        case 'Hommes':      // FR
        case 'Homens':      // PT
        case 'Nam':         // VN
            return 'MEN';
        case 'Women':       // EN
        case 'Mujeres':     // ES
        case 'Femmes':      // FR
        case 'Mulheres':    // PT
        case 'Nữ':          // VN
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
