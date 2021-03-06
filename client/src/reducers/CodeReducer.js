import { GET_CODES_STARTED, GET_CODES_FULFILLED, GET_CODES_REJECTED,
        ADD_CODE_STARTED, ADD_CODE_FULFILLED, ADD_CODE_REJECTED,
        DELETE_CODE_STARTED, DELETE_CODE_FULFILLED, DELETE_CODE_REJECTED,
        ADD_POPUP, CLOSE_POPUP, TRACK_INPUT, ERROR_INPUT_CODE,
        GET_ALLCODE_STARTED, GET_ALLCODE_FULFILLED, GET_ALLCODE_REJECTED
        } from "./../actions/CodeActions";

const initialState = {
    codes: [],
    isFetchingCodes: false,
    fetchingCodesError: null,
    isAddingCode: false,
    addingCodeError: null,
    isDeletingCode: false,
    deletingCodeError: null,
    code: null,
    skuList: [],
    openAdd: null,
    codeInput: null,
    errorInput: null,
    allCode: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CODES_STARTED: {
            return { ...state, isFetchingCodes: true };
        }
        case GET_CODES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingCodes: false, codes: data };
        }
        case GET_CODES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingCodes: false, fetchingCodesError: error };
        }
        case GET_ALLCODE_STARTED: {
            return { ...state, isFetchingCodes: true };
        }
        case GET_ALLCODE_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingCodes: false, allCode: data };
        }
        case GET_ALLCODE_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingCodes: false, fetchingCodesError: error };
        }
        case ADD_CODE_STARTED: {
            return {...state, isAddingCode: true };
        }
        case ADD_CODE_FULFILLED: {
            const data = action.payload;
            /*state.codes.forEach(function(code){
                if (code.sku === data.sku){
                   code.keys.push(data.key);
                }
            });*/
            return {...state, isAddingCode: false, openAdd: false, codeInput: null, addingCodeError: null };
        }
        case ADD_CODE_REJECTED: {
            const data = action.payload.data;
            return {...state, isAddingCode: false, addingCodeError: data};
        }
        case DELETE_CODE_STARTED: {
            return {...state, isDeletingCode: true};
        }
        case DELETE_CODE_FULFILLED: {
            const data = action.payload;
            return {...state, isDeletingCode: false, deletingCodeError: null};
        }
        case DELETE_CODE_REJECTED: {
            const data = action.payload.data;
            return {...state, isDeletingCode: false, deletingCodeError: data}
        }
        case ADD_POPUP: {
            const data = action.payload;
            return {...state, openAdd: data, errorInput: null, addingCodeError: null}
        }
        case CLOSE_POPUP: {
            return {...state, openAdd: null, errorInput: null, addingCodeError: null}
        }
        case TRACK_INPUT: {
            var data = action.payload;
            return { ...state, codeInput : data};
        }
        case ERROR_INPUT_CODE: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        default: {
            return state;
        }
    }
}

function makeSkuList(list, codes) {
    list.forEach(function(item){

    });
}
