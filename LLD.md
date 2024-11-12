## Non Reactive Store

- Create a StateClass with functions to Add, Modify Data, Clean and GetData
- Share the reference of this StateClass object via plugin using globalProperties. (or windows object in case of any complexity)


```
class AssetsStore {
    constructor() {
        this.fonts = {};
        this.fontsFamilies = {};
    }

    addData(fontsData) {}
}
```

## Event Bus

- use mitt library

    ### Events
    - AssetsAdded (fontIds, familyIds, trigger) - whenever new assets are added
    - AssetsRemoved (fontIds, familyIds, trigger) - whenever assets are removed
    - AssetsModified (fontIds, familyIds, trigger) - whenever assets are modified
    - FilterResultsChanged - whenever filters results updated [you have to pull this will not push data]

    ### Triggers
    - HlsTrigger
    - UIStateTrigger
    - UIMetaDataTrigger

## Filter And Font List Activation Status Calculation

- There will be a service component that will be responsible for these calculations.
- It will listen or watch for following changes
    - Either It will watch for filters apply [which will be done via store] or it may use current store initialization pattern to provide a definition for bulk Filter Apply. [Second approach will be used in case bulk apply filter is approved and is integrated in UI]
    - It will watch for assetsAdded, assetsRemoved and assetsModified events only for HlsTrigger,
- After any of the above change occurred
    - It will show loading screen if necessary [e.g. in case of filters apply] and for activationStatus always
    - Put a small delay of say 50-100ms [so that any other UI component gets time to update its status]
    - Start Calculation To ApplyFilter (visual, style, language, search, sorting)
    - After Calculation is complete then give a delay of 50-100ms (so that UI components gets time to update its status)
    - Stop Showing Loading Screens
- We will move filter state to store

## FamilyActivation Status & Font Activation Status Binding

- We will directly update allData and listen to events to immeditaley reflect state in the UI.
- SyncedFonts List will listen to the following events for change in state
    - AssetsModified with Trigger UIState
    - It will not listen to Add or Remove event as that will be handled via FilterResultsChanged. In Synced fonts screen we just want to show the state change immediately.
- MyLibrray FontList or FavoritesList will listen to the following events
    - AssetsModified
    - AssetsAdded
    - AssetsRemoved
- Family Pages[Family-Item & Family-details] will ask its parent list components [synced-fonts list or mylibrary list] to provide function to listen to changes
    - FamilyPages will be getting fontsData with state in props
    - We will watch for this fontsData with immediate as true and assign this to a data property say updatedFontsData
    - UpdatedFontsData will be passed to family-details page and this will be used to show fontsData.
    - We will add a onModifyListener with help of function given by parent list to addListener on assetModification
    - OnModify in FamilyPages
        - If FamilyIds{recieved via modfiy event} doesnot contain the currentFamilyId{received in props} then do not do anything.
        - will update font activateState in updatedFontsData with help of StateLibrary
    - We will also watch updatedFontsData in FamilyPages
        - On Its change , we will mark activationStatus calculation in progress for family.
        - Wait for 50-100ms for better frame rate and give another components a chance to run its logic
        - Calculate ActivationStatus of the family
        - Mark As Done
    - As per current implementation, these calculations [watchers & onmodify func] for family-pages will be done inside family-renderer[higher order component] component


## Meta Data Flow

- For now we will keep the existing behaviour like fetching data when family details page is open. To support filters as well as data on
family-row in synced-fonts view, changes will be done in phase2.

### Phase1

- On Family Details Page use the existing flow as it is


### Phase2

- 


## Abbreviations or Jargons or Terminology

- StateLibrary - the library that is having allData with non-reactivity
- FamilyPages - family details & family item page
- List Pages - Synced_fonts, FontList (FontSet & favorites)




