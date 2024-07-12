import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { EntryDTOFactory, EntryResponse } from '@api/dto';
import { ScenarioCreateForm, ScenarioUpdateForm } from '@api/forms';
import { EntryService, ScenarioService, ScenarioWorkerService, ReportService } from '@domain/services';

@ApiTags('entries')
@Controller('entries/:entryId/scenario')
@UseGuards(JwtAuthGuard)
export class EntryScenarioController extends BaseController {
    constructor(
        private readonly entryService: EntryService,
        private readonly scenarioService: ScenarioService,
        private readonly workerService: ScenarioWorkerService,
        private readonly reportService: ReportService,
    ) {
        super();
    }

    @Post('/')
    @ApiOperation({ summary: 'Set scenario for entry' })
    @ApiResponse({ status: 404, description: 'Entry not found' })
    @ApiResponse({ status: 400, description: 'Entry already has scenario selected' })
    @ApiResponse({ status: 200, description: 'Succesfully set scenario' })
    public async selectScenario(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Body() createScenarioForm: ScenarioCreateForm,
    ): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(entryId, { populate: ['_scenario'] as any });

        if (entry.scenario) {
            return this.clientError('Entry already has a scenario selected. Delete the scenario first.');
        }

        entry.selectScenario({
            entry: entry,
            type: createScenarioForm.type,
            specs: createScenarioForm.specifications,
            distro: createScenarioForm.distributions,
        });

        await this.entryService.persist(entry);
        await this.workerService.importWorkers(entry.scenario);

        return EntryDTOFactory.fromEntity(entry);
    }

    @Patch('/')
    @ApiOperation({ summary: 'Update a scenario specifications' })
    @ApiResponse({ status: 201, description: 'Updated scenario' })
    @ApiResponse({ status: 404, description: 'Scenario not found' })
    public async updateScenario(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Body() updateScenarioForm: ScenarioUpdateForm,
    ): Promise<EntryResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const original = await this.scenarioService.findOne({ _entry: entryId } as any);
        const updated = ScenarioUpdateForm.updateEntity(original, updateScenarioForm);

        if(updateScenarioForm.distributions || updateScenarioForm.specifications) {
            // Update requires new report
            await this.reportService.calculateReport(updated.entry);
        }

        const saved = await this.scenarioService.persist(updated);

        return EntryDTOFactory.fromEntity(saved.entry);
    }

    @Delete('/')
    @ApiOperation({ summary: 'Delete a scenario from an entry' })
    @ApiResponse({ status: 404, description: 'Scenario not found' })
    @ApiResponse({ status: 200, description: 'Successfully deleted scenario from entry' })
    public async deleteScenario(@Param('entryId', ParseUUIDPipe) entryId: string): Promise<EntryResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const entry = await this.entryService.findOne({ _id: entryId } as any);
        entry.clearScenario();
        await this.entryService.persist(entry);

        return EntryDTOFactory.fromEntity(entry);
    }
}
