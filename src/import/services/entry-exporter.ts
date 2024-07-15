import { Workbook } from 'exceljs';

import { Entry } from '@domain/entities';

const SHEET_MAPPING = {
    info: 'Information',
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
        this.fillCostsSheet();
    }

    private setupWorkbook(): Workbook {
        const workbook = new Workbook();
        workbook.creator = 'GIZ Costing Tool';
        workbook.created = new Date();

        workbook.addWorksheet(SHEET_MAPPING.info);
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
    }

    private fillInfoSheet(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.info);

        sheet.addRow(['Entry ID', this.entry.id]);
        sheet.addRow(['Matrix ID', this.entry.matrixId]);
        sheet.addRow(['Facility ID', this.entry.facility.facilityId]);
        sheet.addRow(['Facility Name', this.entry.facility.name]);
        sheet.addRow(['Country', this.entry.facility.country]);
        sheet.addRow(['Currency', this.entry.payroll.currencyCode]);
        sheet.addRow(['Products', this.entry.facility.products]);
        sheet.addRow(['Annual production', `${this.entry.facility.productionAmount} ${this.entry.facility.productionUnit}`]);
        sheet.addRow(['Year', this.entry.payroll.year]);
        sheet.addRow(['Benchmark year', this.entry.benchmark.year]);
        sheet.addRow(['Benchmark value', this.entry.benchmark.value]);
        sheet.addRow(['Benchmark region', this.entry.benchmark.region]);
        sheet.addRow(['# of job categories', this.entry.payroll.nrOfJobCategories]);
        sheet.addRow(['# of workers', this.entry.payroll.nrOfWorkers]);
        sheet.addRow(['# of workers below living wage', this.entry.payroll.nrOfWorkersWithLWGap]);

        sheet.addRow(['Export date', new Date().toISOString()]);
    }

    private fillCostsSheet(): void {
        this.addComparison();
        this.addAnnualCosts();
    }

    private addComparison(): void {
        const entry = this.entry.payroll;
        const scenario = this.entry.scenario.payroll;
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.costs);

        const header = sheet.addRow(['Comparison', 'Status Quo', 'Scenario']);
        sheet.addRow(['Employees below living wage', entry.nrOfWorkersWithLWGap, scenario.nrOfWorkersWithLWGap]);
        sheet.addRow(['Average living wage gap', entry.avgLivingWageGap, scenario.avgLivingWageGap]);
        sheet.addRow(['Facility wide living wage gap', entry.sumAnnualLivingWageGapAllWorkers, scenario.sumAnnualLivingWageGapAllWorkers]);
        sheet.addRow([null]);

        header.font = { bold: true };
        header.height = 20;
    }

    private addAnnualCosts(): void {
        const sheet = this.workbook.getWorksheet(SHEET_MAPPING.costs);
        const facilityReport = this.entry.scenario.report;
        const buyerReport = this.entry.scenario.getBuyerReport();

        const header = sheet.addRow(['Annual costs', 'Facility', 'Buyer']);
        sheet.addRow(['Voluntary contribution requested', facilityReport.remunerationIncrease, buyerReport.remunerationIncrease]);
        sheet.addRow(['Additional labor costs (including taxes)', facilityReport.taxCosts, buyerReport.taxCosts]);
        sheet.addRow(['Overhead costs', facilityReport.overheadCosts, buyerReport.overheadCosts]);
        const totalCosts = sheet.addRow(['Total costs', facilityReport.totalCosts, buyerReport.totalCosts]);
        sheet.addRow(['Annual production', this.entry.facility.productionAmount, this.entry.buyer.amount]); // TODO: fix per unit
        const costImplication = sheet.addRow(['Cost implication per unit', facilityReport.totalCostsPerUnit, buyerReport.totalCostsPerUnit]);
        sheet.addRow([null]);

        header.font = { bold: true };
        header.height = 20;

        [totalCosts.getCell(2), totalCosts.getCell(3)].forEach(cell => cell.border = { top: { style: 'thin' } });
        [costImplication.getCell(2), costImplication.getCell(3)].forEach(cell => cell.border = { top: { style: 'thin' } });
    }
}
