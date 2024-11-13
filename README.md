## UI Tweaks
- Show Results button Will be added to allow filters in bulk [Figma Needed]
- Need Disable State For Filters while filters calculation in progress so that user can not re-apply filter during that duration. [Figma Needed]
- Need Pagination Bar [Figma Needed]
- Font List Activation Status & Family Activation Status Loading State [Activating State will be reused]
- Need Loading Screen For Filter Applying & Pagination [Existing loading Screen Will be Resued]
- Need a Loading Icon for count in the ActivationStatus Filter Button. [use Skeleton Loading]

## Functionality Tweaks
- Languages Filters
  - We will show all languages in the language filter. 
  - When user will select languages. The and operation for all the languages will be performed on the font level. 
  - In case any font doesn't exist for the selected language we will show no result screen
- Visual Filters
  - We will show complete range regardless of fonts synced
  - In case font doesn't exist for given range , we will show no results found screen
- Activation Status Filter
  - We will not show any count in the doropdown section

## Requirements Or Dependency 
- Visual filters
  - need maximum and minimum values for all the visual filters 
  - need range names for all the ranges


## APIs Needed [Moved to phase2]

- An API needed for fetching variations & familyMetaData where there should be no limit at variationids
  - As of now there is a limit of 50 variationIds & 10 familyIds at max. We want to have familyids limit but not variations limit.

