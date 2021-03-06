import async from "async";

import {
    createColor as createColorDAO,
    getColorByKey as getColorByKeyDAO,
    getColorById as getColorByIdDAO,
    getColors as getColorsDAO,
    updateColorById as updateColorByIdDAO,
    removeColorById as removeColorByIdDAO,
    createPattern as createPatternDAO,
    getPatternByKey as getPatternByKeyDAO,
    getPatternById as getPatternByIdDAO,
    getPatterns as getPatternsDAO,
    updatePatternById as updatePatternByIdDAO,
    removePatternById as removePatternByIdDAO,
    createQuality as createQualityDAO,
    getQualityByKey as getQualityByKeyDAO,
    getQualityById as getQualityByIdDAO,
    getQualities as getQualitiesDAO,
    updateQualityById as updateQualityByIdDAO,
    removeQualityById as removeQualityByIdDAO,
    createSize as createSizeDAO,
    getSizeByKey as getSizeByKeyDAO,
    getSizeById as getSizeByIdDAO,
    getSizes as getSizesDAO,
    updateSizeById as updateSizeByIdDAO,
    removeSizeById as removeSizeByIdDAO,
    createType as createTypeDAO,
    getTypeByKey as getTypeByKeyDAO,
    getTypeById as getTypeByIdDAO,
    getTypes as getTypesDAO,
    updateTypeById as updateTypeByIdDAO,
    removeTypeById as removeTypeByIdDAO,
    createUnit as createUnitDAO,
    getUnitByKey as getUnitByKeyDAO,
    getUnitById as getUnitByIdDAO,
    getUnits as getUnitsDAO,
    updateUnitById as updateUnitByIdDAO,
    removeUnitById as removeUnitByIdDAO

} from "./../dao/mongo/impl/FeatureDAO";

//import { getInventories as getInventoriesDAO } from "./../dao/mongo/impl/InventoryDAO";

import { getNextQualityId, getNextTypeId, getNextPatternId, getNextColorId, getNextSizeId, getNextUnitId } from "./CounterService";

//import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function createFeature(data, callback){
   async.waterfall([
     function (waterfallCallback) {
         const { roles, company } = data.userSession;
         const { isStoreManager, isAdmin } = getUserRoles(roles);
         if ((isStoreManager || isAdmin) && company === 'ISRA') {
             waterfallCallback();
         }
         else {
             const err = new Error("Not Enough Permission to create code");
             waterfallCallback(err);
         }
     },
     function(waterfallCallback){
        const { kind, key, description } = data;
        if (kind === "Quality"){
            getQualityByKeyDAO(key, function(err, quality){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (quality) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextQualityId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createQualityDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else if (kind === "Type"){
            getTypeByKeyDAO(key, function(err, type){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (type) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextTypeId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createTypeDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else if (kind === "Pattern"){
            getPatternByKeyDAO(key, function(err, pattern){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (pattern) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextPatternId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createPatternDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else if (kind === "Color"){
            getColorByKeyDAO(key, function(err, color){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (color) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextColorId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createColorDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else if (kind === "Size"){
            getSizeByKeyDAO(key, function(err, size){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (size) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextSizeId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createSizeDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else if (kind === "Unit"){
            getUnitByKeyDAO(key, function(err, unit){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (unit) {
                      const err = new Error("Key Already Exists");
                      waterfallCallback(err)
                  }
                  else {
                      getNextUnitId(function(err, counterDoc){
                           if (err){
                              waterfallCallback(err);
                           }
                           else {
                              const submit = {
                                  id: counterDoc.counter,
                                  key: key,
                                  description: description
                              }
                              createUnitDAO(submit, waterfallCallback);
                           }
                      });
                  }
            });
        }
        else {
            const err = new Error("Undefined kind");
            waterfallCallback(err);
        }
     }
   ],callback);
}

export function updateFeature(data, callback) {
      async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isAdmin } = getUserRoles(roles);
            if ((isStoreManager || isAdmin) && company === 'ISRA') {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to update feature");
                waterfallCallback(err);
            }
        },
        function(waterfallCallback){
            const { id, kind, description, key } = data;
            if (kind === "Quality"){
                const data = {
                    key: key,
                    description: description
                }
                updateQualityByIdDAO(id, data, waterfallCallback);
            }
            else if (kind === "Type"){
                const data = {
                    key: key,
                    description: description
                }
                updateTypeByIdDAO(id, data, waterfallCallback);
            }
            else if (kind === "Pattern"){
                const data = {
                    key: key,
                    description: description
                }
                updatePatternByIdDAO(id, data, waterfallCallback);
            }
            else if (kind === "Color"){
                const data = {
                    key: key,
                    description: description
                }
                updateColorByIdDAO(id, data, waterfallCallback);
            }
            else if (kind === "Size"){
                const data = {
                    key: key,
                    description: description
                }
                updateSizeByIdDAO(id, data, waterfallCallback);
            }
            else if (kind === "Unit"){
                const data = {
                    key: key,
                    description: description
                }
                updateUnitByIdDAO(id, data, waterfallCallback);
            }
            else {
                const err = new Error("Feature Not Found");
                waterfallCallback(err);
            }
        }
      ],callback);
}

export function removeFeature(data, callback){
    async.waterfall([
      function (waterfallCallback) {
          const { roles, company } = data.userSession;
          const { isStoreManager, isAdmin } = getUserRoles(roles);
          if ((isStoreManager || isAdmin) && company === 'ISRA') {
              waterfallCallback();
          }
          else {
              const err = new Error("Not Enough Permission to delete feature");
              waterfallCallback(err);
          }
      },
      function(waterfallCallback){
          const { id, kind } = data;
          if (kind === "Quality"){
              removeQualityByIdDAO(id, waterfallCallback);
          }
          else if (kind === "Type"){
              removeTypeByIdDAO(id, waterfallCallback);
          }
          else if (kind === "Pattern"){
              removePatternByIdDAO(id, waterfallCallback);
          }
          else if (kind === "Color"){
              removeColorByIdDAO(id, waterfallCallback);
          }
          else if (kind === "Size"){
              removeSizeByIdDAO(id, waterfallCallback);
          }
          else if (kind === "Unit"){
              removeUnitByIdDAO(id, waterfallCallback);
          }
          else {
              const err = new Error("Feature Not Found");
              waterfallCallback(err);
          }
      }
    ],callback);
}

export function getQualities(callback){
    getQualitiesDAO(callback);
}

export function getTypes(callback){
    getTypesDAO(callback);
}

export function getPatterns(callback){
    getPatternsDAO(callback);
}

export function getColors(callback){
    getColorsDAO(callback);
}

export function getSizes(callback){
    getSizesDAO(callback);
}

export function getUnits(callback){
    getUnitsDAO(callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isStoreManager, isAdmin };
}
