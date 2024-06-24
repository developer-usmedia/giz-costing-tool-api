export const SHEET_PAYROLL_INDEX = 2;
export const SHEET_PAYROLL_START_ROW = 4;

export const SHEET_MAPPING = {
    info: 1,
    payroll: 2,
} as const;

export const INFO_SHEET_COLUMN = 'B';
// TODO: Ideally this needs to be <string, number> but fetching with row number
// and column string gives me an error while reading
// This means that info sheet errors will have the 'B' in their row index
export const INFO_SHEET_MAPPING = {
    templateVersion: 'B21',
    facilityName: 'B1',
    facilityId: 'B2',
    benchmarkName: 'B19',
    country: 'B6',
    region: 'B7',
    annualProduction: 'B10',
    unitOfProduction: 'B13',
    productName: 'B16',
    year: 'B17',
    currencyCode: 'B18',
    countryCode: '-1',
} as const;

export const COLUMN_MAPPING_PAYROLL = {
    name: 'C',
    gender: 'D',
    numberOfWorkers: 'E',
    monthlyWage: 'AQ',
    monthlyBonus: 'AR',
    percentageOfYearsWorked: 'AT',

    ikbFood: 'AB',
    ikbTransportation: 'AD',
    ikbHousing: 'AF',
    ikbHealthcare: 'AH',
    ikbChildEducation: 'AJ',
    ikbChildCare: 'AL',

    benchmarkValue: 'AW',
} as const;