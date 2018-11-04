bur.ConfigurationBasicQuery = (function () {

  var VEHICLE_CHANGE_PROPERTIES = {
    msc: true,
    bodyStyle: true,
    grade: true,
    engine: true
  };

  function ConfigurationBasicQuery(vehicleData) {
    this.vehicleData = vehicleData;
  }

  function isValidVehicleChange(vehicleObj, newValueId, typeId, configurationObj) {
    return VEHICLE_CHANGE_PROPERTIES[typeId] && vehicleObj !== configurationObj && vehicleObj[typeId] === newValueId;
  }

  function getVehicleWithMatchingProperties(vehicleObj, newValueId, typeId, configurationObj) {
    var matchingVehicleObj;

    if (isValidVehicleChange(vehicleObj, newValueId, typeId, configurationObj)) {
      matchingVehicleObj = vehicleObj;
    } else if (!VEHICLE_CHANGE_PROPERTIES[typeId]) {
      matchingVehicleObj = getVehicleWithANonChangeableProperty.bind(this)(vehicleObj, newValueId, typeId);
    }

    return matchingVehicleObj;
  }

  function getVehicleWithANonChangeableProperty(vehicleObj, newValueId, typeId) {
    let mustExcludeList = getMustExcludeList.bind(this)(typeId.toLowerCase(), newValueId)
      , isValidVehicule = true
      , matchingVehicleObj;

    if (mustExcludeList.length > 0) {
      isValidVehicule = !mustExcludeList.find((excludedType) => excludedType[Object.keys(excludedType)[0]] === vehicleObj[Object.keys(excludedType)[0]]);
    }

    if (isValidVehicule) {
      matchingVehicleObj = vehicleObj;      
    } else {
      matchingVehicleObj = getCopyOfVehicleObject(getValidMSCFromVehicleData.bind(this)(mustExcludeList));
      
    }
    matchingVehicleObj[typeId] = newValueId;
    return matchingVehicleObj;
  }

  function getValidMSCFromVehicleData(mustExcludeList) {
    const vehiculeList = this.vehicleData.mscs;
    const returnedVehicle = vehiculeList.find(vehicule =>
      !mustExcludeList.find((excludedType) => excludedType[Object.keys(excludedType)[0]] === vehicule[Object.keys(excludedType)[0]]));

    return returnedVehicle;
  }

  function getMustExcludeList(typeId, newValueId) {
    const vehicleData = this.vehicleData;
    let mustExcludeList = [];

    if (typeId === 'color') {
      mustExcludeList = vehicleData.colors[newValueId].mustExclude;
    }

    if (typeId === 'trim') {
      mustExcludeList = vehicleData.trims[newValueId].mustExclude;
    }

    return mustExcludeList;
  }

  function getCopyOfVehicleObject(vehicle) {
    return bur.Utils.shallowCloneObject(vehicle);
  }

  function getIndexOfMsc(mscStr, vehicles) {
    var i,
      numberOfVehicles = vehicles.length;

    for (i = 0; i < numberOfVehicles; i += 1) {
      if (mscStr === vehicles[i].msc) {
        return i;
      }
    }
  }

  function getVehiclesToBeSearched(vehicles, configurationObj) {
    var numberOfVehicles = vehicles.length,
      clonedVehicles = vehicles.slice(0),
      startingIndex = getIndexOfMsc(configurationObj.msc, clonedVehicles),
      startingVehicles = clonedVehicles.splice(startingIndex, numberOfVehicles - startingIndex);

    return startingVehicles.concat(clonedVehicles);
  }

  ConfigurationBasicQuery.prototype.getInitialConfiguration = function () {
    return this.vehicleData.mscs[0];
  };

  ConfigurationBasicQuery.prototype.getAvailableTypes = function (typeId, bodyStyleId) {
    var items = [];

    this.vehicleData.mscs.forEach(function (vehicleObj) {
      if (vehicleObj.bodyStyle === bodyStyleId) {
        bur.Utils.addUniqueToArray(vehicleObj[typeId], items);
      }
    });

    return items;
  };

  ConfigurationBasicQuery.prototype.getConfigurationWith = function (newValueId, typeId, configurationObj) {
    var i,
      matchingVehicleObj,
      sortedVehicles = getVehiclesToBeSearched(this.vehicleData.mscs, configurationObj),
      numberOfVehicles = sortedVehicles.length;

    for (i = 0; i < numberOfVehicles; i += 1) {
      matchingVehicleObj = getVehicleWithMatchingProperties
        .bind(this)
        (bur.Utils.shallowCloneObject(sortedVehicles[i])
        , newValueId
        , typeId
        , configurationObj
        );

      if (matchingVehicleObj) {
        return matchingVehicleObj;
      }
    }
  };

  return ConfigurationBasicQuery;
}());
