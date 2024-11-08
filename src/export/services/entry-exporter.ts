import { Workbook } from 'exceljs';

import { Entry, ScenarioWorker } from '@domain/entities';
import { ExportComparisonDTOFactory } from '@export/dto/export-comparison.dto';
import { ExportCostsDTOFactory } from '@export/dto/export-costs.dto';
import { ExportInfoDTOFactory } from '@export/dto/export-info.dto';
import { ExportWorkerDTOFactory } from '@export/dto/export-worker.dto';

const SHEET_MAPPING = {
    info: 'Information',
    payroll: 'Payroll',
    costs: 'Costs',
};

export class EntryExporter {
    public entry: Entry;
    public workbook: Workbook;
    
    // Instead of requiring entry param require a DTO? Or pass entry itself
    constructor(entry: Entry){
        this.entry = entry;

        if (this.entry.status !== 'COMPLETED') {
            throw new Error('Cannot export entry with an incomplete status');
        }

        this.workbook = this.setupWorkbook();
        this.styleSheets();
        
        this.fillInfoSheet();
        this.initPayrollSheet();
        this.fillCostsSheet();
    }

    public addWorkersToPayrollSheet(workers: ScenarioWorker[]): void {
        const payrollSheet = this.workbook.getWorksheet(SHEET_MAPPING.payroll); 

        for (const worker of workers) {
            const dto = ExportWorkerDTOFactory.fromEntity(worker);

            payrollSheet.addRow([
                dto.name,
                dto.gender,
                dto.nrOfWorkers,
                dto.monthlyWage,
                dto.monthlyBonus,
                dto.monthlyIkb,
                dto.monthylyRemuneration,
                dto.benchmarkValue,
                dto.percOfYearWorked,
                dto.livingWageGap,
                dto.annualLivingWageGap,
                dto.annualLivingWageGapAllWorkers,
                dto.remunerationIncrease,
                dto.baseWagePerc,
                dto.baseWageIncrease,
                dto.bonusesPerc,
                dto.bonusesIncrease,
                dto.ikbPerc,
                dto.ikbIncrease,
            ]);
        }
    }

    private setupWorkbook(): Workbook {
        const workbook = new Workbook();
        workbook.creator = 'GIZ Costing Tool';
        workbook.created = new Date();

        workbook.addWorksheet(SHEET_MAPPING.info);
        workbook.addWorksheet(SHEET_MAPPING.payroll);
        workbook.addWorksheet(SHEET_MAPPING.costs);

        return workbook;
    }

    private styleSheets(): void {
        const infoSheet = this.workbook.getWorksheet(SHEET_MAPPING.info);
        infoSheet.getColumn(1).width = 30;
        infoSheet.getColumn(2).width = 40;
        infoSheet.getColumn(2).alignment = { horizontal: 'right' };

        const costsSheet = this.workbook.getWorksheet(SHEET_MAPPING.costs);
        costsSheet.getColumn(1).width = 30;
        costsSheet.getColumn(2).width = 15;
        costsSheet.getColumn(3).width = 15;

        const payrollSheet = this.workbook.getWorksheet(SHEET_MAPPING.payroll);
        for (let col = 1; col < 20; col++) {
            payrollSheet.getColumn(col).width = 20;
        }
    }

    private initPayrollSheet(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.payroll);

        const header = sheet.addRow([
            'Job category',
            'Gender',
            'Number of workers',
            'Base wage',
            'Bonuses',
            'In-kind benefits',
            'Monthly total remuneration',
            'Benchmark',
            '% of year worked',
            'Living wage gap',
            'Annual living wage gap',
            'Annual living wage gap (all workers)',
            'Monthly total remuneration increase',
            'Base wage distribution %',
            'Base wage increase',
            'Bonuses distribution %',
            'Bonuses increase',
            'In-kind benefits distribution %',
            'In-kind benefits increase',
        ]);

        header.font = { bold: true };
        header.height = 20;
    }

    private fillInfoSheet(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.info);
        const dto = ExportInfoDTOFactory.fromEntity(this.entry);

        sheet.addRow(['Entry ID', dto.entryId]);
        sheet.addRow(['Matrix ID', dto.matrixId]);
        sheet.addRow(['Facility ID', dto.facilityId]);
        sheet.addRow(['Facility Name', dto.facilityName]);
        sheet.addRow(['Country Code', dto.facilityCountryCode]);
        sheet.addRow(['Currency', dto.currency]);
        sheet.addRow(['Products', dto.products]);
        sheet.addRow(['Annual production', `${dto.productionAmount} ${dto.productionUnit}`]);
        sheet.addRow(['Year', dto.year]);
        sheet.addRow(['Benchmark year', dto.year]);
        sheet.addRow(['Benchmark value', dto.benchmarkValue]);
        sheet.addRow(['Benchmark region', dto.benchmarkRegion]);
        sheet.addRow(['# of job categories', dto.nrOfJobCategories]);
        sheet.addRow(['# of workers', dto.nrOfWorkers]);
        sheet.addRow(['# of workers below living wage', dto.nrOfWorkersWithLwGap]);

        sheet.addRow(['Export date', new Date().toISOString()]);
    }

    private fillCostsSheet(): void {
        this.addComparison();
        this.addAnnualCosts();
    }

    private addComparison(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.costs);
        const dto = ExportComparisonDTOFactory.fromEntity(this.entry);

        const header = sheet.addRow(['Comparison', 'Status Quo', 'Scenario']);
        sheet.addRow(['Employees below living wage', dto.facility.nrOfWorkersBelowLwGap, dto.scenario.nrOfWorkersWithBelowLwGap]);
        sheet.addRow(['Average living wage gap', dto.facility.avgLivingWageGap, dto.scenario.avgLivingWageGap]);
        sheet.addRow(['Facility wide living wage gap', dto.facility.sumAnnualLivingWageGapAllWorkers, dto.scenario.sumAnnualLivingWageGapAllWorkers]);
        sheet.addRow([null]);

        header.font = { bold: true };
        header.height = 20;
    }

    private addAnnualCosts(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.costs);
        const dto = ExportCostsDTOFactory.fromEntity(this.entry);

        const header = sheet.addRow(['Annual costs', 'Facility', 'Buyer']);
        sheet.addRow(['Voluntary contribution requested', dto.facility.remunerationIncrease, dto.buyer.remunerationIncrease]);
        sheet.addRow(['Additional labor costs (including taxes)',dto.facility.taxCosts, dto.buyer.taxCosts]);
        sheet.addRow(['Overhead costs' ,dto.facility.overheadCosts, dto.buyer.overheadCosts]);
        const totalCosts = sheet.addRow(['Total costs', dto.facility.totalCosts, dto.buyer.totalCosts]);
        sheet.addRow(['Annual production', dto.facility.productionAmount, dto.buyer.amount]);
        const costImplication = sheet.addRow(['Cost implication per unit', dto.facility.totalCostsPerUnit, dto.buyer.totalCostsPerUnit]);
        sheet.addRow([null]);

        header.font = { bold: true };
        header.height = 20;

        [totalCosts.getCell(2), totalCosts.getCell(3)].forEach(cell => cell.border = { top: { style: 'thin' } });
        [costImplication.getCell(2), costImplication.getCell(3)].forEach(cell => cell.border = { top: { style: 'thin' } });
    }
}
