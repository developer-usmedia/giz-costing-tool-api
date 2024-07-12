# Ideal world
- Benchmark not editable when more than one worker

- EntryWorker saves LW values
- Recalculate entry-worker happens internally when a worker gets changed

- Entry lw values and averages (+ nrOfC....) (db query) -> result is saved to entry
- Service call does the ^above query when worker is updated/added/deleted

- Scenario-worker calculates ikb, wage, bonus etc... and saves in db to be used by query on report
- ScenarioWorker saves LW values

- Recalculate scenario-worker happens internally when an entry-worker or scenario gets changed/updated- 
- Scenario calculates Entry lw values and averages (+ nrOfC....) (db query) -> result is saved to entry

- Report uses query on saved values above 

