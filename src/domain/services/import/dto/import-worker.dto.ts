import { Gender } from '@domain/enums/gender.enum';

export interface ImportWorkerDTO  {
    name: string;
    gender: Gender;
    numberOfWorkers: number;
    monthlyWage: number;
    monthlyBonus: number;
    percentageOfYearWorked: number;
    employeeTax: number;
    employerTax: number;
}