import { customAlphabet } from 'nanoid';

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generateBasicCode = customAlphabet(CODE_ALPHABET, 6);

export const generateBasicToken = (): string => {
    return generateBasicCode();
};