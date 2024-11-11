## Non Reactive Store

- Create a StateClass with functions to Add, Modify Data, Clean and GetData
- Share the reference of this StateClass object via plugin using globalProperties. (or windows object in case of any complexity)

## Event Bus

- use mitt library
- 

    # Events
    - AssetsAdded (fontIds, familyIds, trigger) - whenever new assets are added
    - AssetsRemoved (fontIds, familyIds, trigger) - whenever assets are removed
    - AssetsModified (fontIds, familyIds, trigger) - whenever assets are modified
    - FilterResultsChanged - whenever filters results updated [you have to pull this will not push data]

    # Triggers
    - HlsTrigger
    - UIStateTrigger
    - UIMetaDataTrigger

## Filter And Font List Activation Status Calculation

- There will be a service component that will be responsible for these calculations.
- It will listen or watch for following changes
    - It will watch for filters apply [which will be done via store]
    - It will watch for assetsAdded, assetsRemoved and assetsModified events only for HlsTrigger,
- After any of the above change occurred
    - It will show loading screen if necessary [e.g. in case of filters apply] and for activationStatus always
    - Put a small delay of say 50-100ms [so that any other UI component gets time to update its status]
    - Start Calculation To ApplyFilter (visual, style, language, search, sorting)
    - After Calculation is complete then give a delay of 50-100ms (so that UI components gets time to update its status)
    - Stop Showing Loading Screens
- We will move filter state to store

## FamilyActivation Status & Font Activation Status Binding

- 


## Meta Data Flow



