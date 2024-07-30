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
    matrixId: 'B1',
    facilityName: 'B2',
    facilityId: 'B3',
    templateVersion: 'B22',
    country: 'B7',
    region: 'B8',
    productionAmount: 'B11',
    productionUnit: 'B14',
    productName: 'B17',
    year: 'B18',
    currencyCode: 'B19',
    benchmarkName: 'B20',
    countryCode: '-1',
} as const;

export const COLUMN_MAPPING_PAYROLL = {
    name: 'C',
    gender: 'D',
    nrOfWorkers: 'E',
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
