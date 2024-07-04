# Endpoints JP
| Method | Endpoint                   | Notes                                                                                   |
|--------|----------------------------|-----------------------------------------------------------------------------------------|
| GET    | /                          | -                                                                                       |
| GET    | /health                    | -                                                                                       |
| GET    | /health/liveness           | -                                                                                       |
| GET    | /health/readiness          | -                                                                                       |
| -      | -                          | -                                                                                       |
| POST   | /auth/register             | -                                                                                       |
| POST   | /auth/verify-code          | -                                                                                       |
| POST   | /auth/verify-email         | -                                                                                       |
| POST   | /auth/forgot-password      | -                                                                                       |
| POST   | /auth/reset-password       | -                                                                                       |
| POST   | /auth/login                | -                                                                                       |
| POST   | /auth/logout               | -                                                                                       |
| POST   | /auth/refresh              | -                                                                                       |
| DELETE | /auth/account              | Maybe rename?                                                                           |
| POST   | /auth/2fa/enable           | -                                                                                       |
| POST   | /auth/2fa/disable          | -                                                                                       |
| POST   | /auth/2fa/verify/:code     | Why code in url?                                                                        |
| GET    | /auth/whoami               | To /whoami                                                                              |
| -      | -                          | -                                                                                       |
| GET    | /entries/:id               | -                                                                                       |
| PATCH  | /entries/:id               | This also allows to set buyer information                                               |
| DELETE | /entries/:id               | -                                                                                       |
| -      | -                          | -                                                                                       |
| POST   | /entries/:id/scenario      | Sets the scenario. If already selected, throw error - it requires a DELETE first        |
| DELETE | /entries/:id/scenario      | Deletes the currently set scenario                                                      |
| PATCH  | /entries/:id/scenario      | Updates scenario specifications and distribution                                        |
| -      | -                          | -                                                                                       |
| GET    | /entries/:id/workers       | Returns worker DTO that includes base info + renumeration + lwGapInfo + scenarioResults |
| POST   | /entries/:id/workers/reset | Resets specification and / or distribution on all workers                               |

# Endpoint sketching

Q: Welke endpoint wil ik als frontender aanroepen om mijn data te fetchen?
Q: Welke endpoint wil ik als frontender aanroepen om data te kunnen updaten?

| Method        | Endpoint                   | Action                                                                                  |
| ------------- | -------------------------- | --------------------------------------------------------------------------------------- |
| GET           | /entries/:id               | Entry DTO + including Scenario DTO (+ report DTO?)                                      |
| PATCH / PATCH | /entries/:id               | This also allows to set buyer information                                               |
| POST          | /entries/:id/scenario      | Sets the scenario. If already selected, throw error - it requires a DELETE first        |
| DELETE        | /entries/:id/scenario      | Deletes the currently set scenario                                                      |
| PATCH         | /entries/:id/scenario      | Updates scenario specifications and distribution                                        |
| GET           | /entries/:id/workers       | Returns worker DTO that includes base info + renumeration + lwGapInfo + scenarioResults |
| POST          | /entries/:id/workers/reset | Resets specification and / or distribution on all workers                               |
|               |                            |                                                                                         |

## Endpoints that did not make it

| Method | Endpoint                   | Action                               | Reason                                |
| ------ | -------------------------- | ------------------------------------ | ------------------------------------- |
| GET    | /scenario/:id/report       | DTO to show on report page           | Report entity is part of the EntryDTO |
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

## Fix forms and DTO's

-   Test working
-   See if there are missing fields
