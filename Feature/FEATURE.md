## Notes
This code was written over 2 years ago. Which is why we are not using classes, arrow functions and so forth.
When completing the this test feel free to use any version of JavaScript supported by Nodes newest version.
If you can complete it in ES3 / ES5 then knock yourself out.

Add German market with different NEW query logic.

The configurator needs to now support the German market of de-de. The market has requested a different logic for managing conflicts, but we cannot affect the markets already using the configurator. The German market will use the same vehicle data that is currently used for the UK.

**Acceptance criteria:**
If any item applied to the configuration is not allowed then it should start at index before the index of the msc you are currently on, and descend through the mscs. It should return the first vehicle that is allowed the item passed to the ```getConfigurationWith()``` function.

**Expected result:**
- Calling ```getConfigurationWith()``` with the value **blue**, **color** and the vehicle obj with msc **221**. Should return the configuration object with an msc property value of **123** and the color value of **blue**.
- Calling ```getConfigurationWith()``` with the value **basic**, **grade** and the vehicle obj with msc **121**. Should return the configuration object with an msc property value of **111**.
