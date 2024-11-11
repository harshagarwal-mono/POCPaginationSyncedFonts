## UI Tweaks
- Apply Filter Button Is Needed So that We can Apply Filter In Batch And Save Some Time.
- Need Loading State For Font List Activation Status.
- Need Disable State For All The Filters If Not Available.
- Need Loading Screen For Filter Applying If Needs To Be Changed.

## Functionaity Tweaks
- Lets Not Show Languages Only For which the fonts are available. Let show all the languages. Certainly it will save some time.
- Lets Only Show Sync Bar When User Clicks On Refresh Button. It will also improve performance
- Lets not show count on ActivationStatus Filter

## Event Bus

Following Events Can be Created
- FontsAdded
- FontsRemoved
- FontsModified [On Both Added + Modified + Removed]
- Apply Filter
- FilterResultsChanged

## Web Worker

Following Message It Will Accept 
Following Messages It Will Give


## Families Page Calculation

- Use deferred calculation to avoid calculation on scroll. [defer for 500ms]
- If Family Is In Active View 

## Filter Section

Listen To Fonts Modified Event on the Event Bus
- Here If we show Filtering Screen. This will Look odd as it is possible that the results are not updated
- But if we don't show then for that duration [even if 100ms]. We will not be able to click on filters Button
- Start Filteration

Watch For Filter Apply in Store
- Mark Filtering In Progress
- Start Filteration
- Mark Filtering As Done


## List Activation Status

Listend To Filter Results Change Event on the Event Bus
- Mark Calculation FontListActivationStatus In Progress.
- Calculate FontList Activation Status 
- Mark Calculation FontListActivatioStatus As Done.

## Meta Data Calls


## Miscalleneous
- Lets move The OS Notification Count Calculation Logic & Sync Bar Logic To HLS. This will save a lot of time at UI
- 


# Challenges

- Binding Font State For MyLibrary & SyncedFonts.

