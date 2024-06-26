# Endpoint sketching

Q: Welke endpoint wil ik als frontender aanroepen om mijn data te fetchen?
Q: Welke endpoint wil ik als frontender aanroepen om data te kunnen updaten?

| Method            | Endpoint                      | Action                                                                           |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| GET               | /entries/:id                    | Entry DTO + including Scenario DTO (+ report DTO?)                               |
| PATCH / PATCH     | /entries/:id                    | This also allows to set buyer information                                        |
| POST              | /entries/:id/scenario           | Sets the scenario. If already selected, throw error - it requires a DELETE first |
| DELETE            | /entries/:id/scenario           | Deletes the currently set scenario                                               |
| PATCH             | /entries/:id/scenario           | Updates scenario specifications and distribution                                 |
|                   |                               |                                                                                  |
|                   |                               |                                                                                  |
| PATCH/POST/DELETE | /scenario/:id                 | (optional) same routes /entries/:id/scenario                                       |
| GET               | /scenario/:id/workers         | Gets ScenarioWorkers for scenario                                                |
| GET               | /scenario/:id/workers/:id     | Get a ScenarioWorker for scenario                                               |
| PATCH             | /scenario/:id/workers/:id     | Update a ScenarioWorker                                                          |
| GET               | /scenario/:id/report/download | Generates report export on demand (?)                                            |

## Endpoints that did not make it

| Method | Endpoint                 | Action                               | Reason                                |
| ------ | ------------------------ | ------------------------------------ | ------------------------------------- |
| GET    | /scenario/:id/report     | DTO to show on report page           | Report entity is part of the EntryDTO |
| GET    | /entries?projection=report | include report DTO in each entry DTO | Could be future improvement           |

## Select a scenario

Entry has no scenario set

-   POST `/entries/:id/scenario`

Entry has a scenario set and needs to update the speciications **or** distributions

-   PATCH `/entries/:id/scenario`

User unselects a scenario

-   DELETE `/entries/:id/scenario`

## Fetching & updating ScenarioWorker

Scenario or Distribution tab needs to display the workers of the scenario

-   GET `/scenario/:id/workers`

Scenario tab overrides the scenario calculations

-   PATCH `/scenario/:id/workers/:id`

Distribution tab overrides the default distributions

-   PATCH `/scenario/:id/workers/:id`

## Fetching details to show on report page

-   GET `/entries/:id/` include the report DTO
    and
-   GET `/entries` does not include the report DTO (possible improvement with projection later)

## Download a report

-   GET `/entries/:id/report/download`

# TODO:

-   Reset ScenarioWorker wage overrides (endpoint)
-   Reset ScenarioWorker distribution overrides (endpoint)
