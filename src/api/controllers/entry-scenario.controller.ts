import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { EntryDTOFactory, EntryResponse } from '@api/dto';
import { ScenarioCreateForm, ScenarioUpdateForm } from '@api/forms';
import { EntryService, ScenarioService, ScenarioWorkerService } from '@domain/services';

@ApiTags('entries')
@Controller('entries/:entryId/scenario')
@UseGuards(JwtAuthGuard)
export class EntryScenarioController extends BaseController {
    constructor(
        private readonly entryService: EntryService,
        private readonly scenarioService: ScenarioService,
        private readonly workerService: ScenarioWorkerService,
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

        const scenario = ScenarioCreateForm.toEntity(createScenarioForm, entry);
        await this.scenarioService.persist(scenario);
        await this.workerService.importWorkers(scenario);

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
        const saved = await this.scenarioService.persist(updated);

        return EntryDTOFactory.fromEntity(saved.entry);
    }

    @Delete('/')
    @ApiOperation({ summary: 'Delete a scenario from an entry' })
    @ApiResponse({ status: 404, description: 'Scenario not found' })
    @ApiResponse({ status: 200, description: 'Successfully deleted scenario from entry' })
    public async deleteScenario(@Param('entryId', ParseUUIDPipe) entryId: string): Promise<EntryResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const scenario = await this.scenarioService.findOne({ _entry: entryId } as any);
        await this.scenarioService.remove(scenario);

        return EntryDTOFactory.fromEntity(scenario.entry);
    }
}