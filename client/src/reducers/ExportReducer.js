import {
          APPROVE_EXPORT_STARTED, APPROVE_EXPORT_FULFILLED, APPROVE_EXPORT_REJECTED,
           GET_PENDING_EXPORTS_STARTED, GET_PENDING_EXPORTS_FULFILLED, GET_PENDING_EXPORTS_REJECTED,
           GET_APPROVED_EXPORTS_STARTED, GET_APPROVED_EXPORTS_FULFILLED, GET_APPROVED_EXPORTS_REJECTED,
           CHANGE_EXPORT_STARTED, CHANGE_EXPORT_FULFILLED, CHANGE_EXPORT_REJECTED,
           DELETE_EXPORT_STARTED, DELETE_EXPORT_FULFILLED, DELETE_EXPORT_REJECTED,
           DUPLICATE_EXPORT_STARTED, DUPLICATE_EXPORT_FULFILLED, DUPLICATE_EXPORT_REJECTED,
           CHANGE_POPUP, CLOSE_POPUP, TRACK_NUMBER, FILL_CODE, CLEAR_EXPORT, INPUT_CAPACITY, INPUT_COUNT,
           EXPORT_INVENTORY_STARTED, EXPORT_INVENTORY_FULFILLED, EXPORT_INVENTORY_REJECTED, SORT_EXPORT,
           REV_EXPORT, NEXT_EXPORT, MODIRY_EXPORT
      } from "./../actions/ExportActions";

const initialState = {
    pendingExports: [],
    approvedExports: [],
    nextExport: null,
    isExportingInventory: false,
    exportingInventoryError: null,
    isFetchingPendingExports: false,
    fetchingPendingExportsError: null,
    isFetchingApprovedExports: false,
    fetchingApprovedExportsError: null,
    isApprovingExport: false,
    approvingExportError: null,
    isChangingExport: false,
    changingExportError: null,
    isDeletingExport: false,
    deletingExportError: null,
    isDuplicatingExport: false,
    duplicatingExportError: null,
    export: null,
    response: null,
    change: null,
    quantity: null,
    add: false,
    defaultExport: {
        code: null,
        capacity: 24,
        box: null
    },
    capacity: null,
    count: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case EXPORT_INVENTORY_STARTED: {
            return { ...state, isExportingInventory: true };
        }
        case EXPORT_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isExportingInventory: false, exportingInventoryError: null, nextExport: data };
        }
        case EXPORT_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isExportingInventory: false, exportingInventoryError: error };
        }
        case GET_PENDING_EXPORTS_STARTED: {
            return { ...state, isFetchingPendingExports: true };
        }
        case GET_PENDING_EXPORTS_FULFILLED: {
            const data = action.payload;
            //data.sort(compareSku);
            return { ...state, isFetchingPendingExports: false, pendingExports: data };
        }
        case GET_PENDING_EXPORTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingExports: false, fetchingPendingExportsError: error };
        }
        case GET_APPROVED_EXPORTS_STARTED: {
            return { ...state, isFetchingApprovedExports: true };
        }
        case GET_APPROVED_EXPORTS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingApprovedExports: false, approvedExports: data };
        }
        case GET_APPROVED_EXPORTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingApprovedExports: false, fetchingApprovedExportsError: error };
        }
        case APPROVE_EXPORT_STARTED: {
            return { ...state, isApprovingExport: true };
        }
        case APPROVE_EXPORT_FULFILLED: {
            const exportData = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingExports.length; i++){
                if (state.pendingExports[i].id === exportData.id ){
                    index = i;
                }
            }
            state.pendingExports.splice(index,1);
            return { ...state, isApprovingExport: false, approvingExportError: null };
        }
        case APPROVE_EXPORT_REJECTED: {
            const error = action.payload.data;
            return { ...state, isApprovingExport: false, approvingExportError: error };
        }
        case CHANGE_EXPORT_STARTED: {
            return {...state, isChangingExport: true };
        }
        case CHANGE_EXPORT_FULFILLED: {
            const data = action.payload;
            state.pendingExports.forEach(function(item){
                if (item.id === data.id) {
                    item.quantity = data.quantity;
                    item.capacity = data.capacity;
                    item.count = data.count;
                }
            });
            return {...state, isChangingExport: false, approvingExportError: null  };
        }
        case CHANGE_EXPORT_REJECTED: {
            const error = action.payload.data;
            return {...state, isChangingExport: false, changingExportError: error };
        }
        case DELETE_EXPORT_STARTED: {
            return {...state, isDeletingExport: true };
        }
        case DELETE_EXPORT_FULFILLED: {
            const data = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingExports.length; i++){
                if (state.pendingExports[i].id === data.id ){
                    index = i;
                }
            }
            state.pendingExports.splice(index,1);
            return {...state, isDeletingExport: false, deletingExportError: null };
        }
        case DELETE_EXPORT_REJECTED: {
            const data = action.payload.data;
            return {...state, isDeletingExport: false, deletingExportError: data};
        }
        case DUPLICATE_EXPORT_STARTED:{
            return { ...state, isDuplicatingExport: true };
        }
        case DUPLICATE_EXPORT_FULFILLED:{
            const data = action.payload;
            return { ...state, isDuplicatingExport: false };
        }
        case DUPLICATE_EXPORT_REJECTED:{
            const error = action.payload;
            return { ...state, isDuplicatingExport: false, duplicatingExportError: error };
        }
        case CHANGE_POPUP: {
            const data = action.payload;
            return {...state, change: data}
        }
        case CLOSE_POPUP: {
            return {...state, change: null}
        }
        case TRACK_NUMBER: {
            var data = action.payload;
            const number = parseInt(data);
            return { ...state, quantity : number};
        }
        case FILL_CODE:{
            const data = action.payload;
            return { ...state, defaultExport: {code: data, capacity: 24, box: null} };
        }
        case CLEAR_EXPORT:{
            return { ...state, defaultExport: {code: null, capacity: 24, box: null} };
        }
        case INPUT_CAPACITY:{
            const data = action.payload;
            return { ...state, capacity: data };
        }
        case INPUT_COUNT:{
            const data = action.payload;
            return { ...state, count: data };
        }
        case SORT_EXPORT:{
            const data = action.payload;
            if (data === 'sku') state.pendingExports.sort(compareSku);
            else if (data === 'quantity') state.inventories.sort(compareQuantity);
            else if (data === 'data') state.inventories.sort(compareDate);
            return { ...state };
        }
        case REV_EXPORT:{
            state.pendingExports.reverse();
            return { ...state };
        }
        case NEXT_EXPORT:{
            const { exportData, response } = action.payload;
            var index = state.pendingExports.indexOf(exportData);
            state.pendingExports[index].count = state.pendingExports[index].count - response.count;
            state.pendingExports[index].quantity = state.pendingExports[index].count * state.pendingExports[index].capacity;
            state.pendingExports.splice(index + 1, 0, response);
            return { ...state};
        }
        default: {
            return state;
        }
    }
}

function compareSku(a,b){
    const idA = a.sku;
    const idB = b.sku;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}