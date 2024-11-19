# Database Usage 

## Index DB in Browser

- We have to create 2 different database one for filtered and one for all
- filter will traverse using cursor and get 1000 results and apply filtering and save them
- While applying the filter we have to apply sorting in parallel. We have to keep all the sorted familyId in memory. 
  Can't do that with database

### Limitations
- 2 GB limit on machine via a origin
- Doesn't Allow You to Execute Query

## Sql3 via ElecronJs

### Query
- This is the query that may be used. There may be some changes required in this query
```
WITH FilteredResults AS (
    SELECT *
    FROM Fonts
    WHERE name LIKE '%sans%'
),
TotalCount AS (
    SELECT COUNT(*) AS total_count
    FROM FilteredResults
),
PagedResults AS (
    SELECT *, MAX(modified_at) AS max_modified_at, STRING_AGG(FontId::VARCHAR, ', ') AS font_ids
    FROM FilteredResults
    GROUP BY familyId
)
SELECT 
    p.*,
    t.total_count
FROM (
    SELECT * 
    FROM PagedResults
    ORDER BY max_modified_at DESC
    LIMIT 10 OFFSET 20 
) p, TotalCount t;
```

### Limitations 
- Have native dependencies so it may pose some issues while app building in electron
- Getting State based on fontId will take some time. So we may see state update after some time


## Changes In LLD

#### UI Tweaks
- We will need a family Details & Fonts Details Lazy Loading Screens

#### Activation Status 
- We will pass only FontIds to Family-Renderer
- FontsData will be calculated based on that for family-details only
- We may have to locally change the font activation state so that we are able to immediately change the results.

