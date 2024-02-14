import { customAlphabet } from 'nanoid';

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generateBasicCode = customAlphabet(CODE_ALPHABET, 5);

export const generateBasicToken = (): string => {
    return generateBasicCode();
};