import Immutable from "immutable";
import { combineReducers } from "redux-immutable";
import { get, post } from "../../utils/request";
import url from "../../utils/url";
import { actions as appActions } from "./app";

// action types
export const types = {
  FETCH_REMARKS: "REMARKS/FETCH_REMARKS",
  CREATE_REMARK: "REMARKS/CREATE_REMARK"
};

// action creators
export const actions = {
  fetchRemarks: topicId => {
    return (dispatch, getState) => {
      if (shouldFetchRemarks(topicId, getState())) {
        dispatch(appActions.startRequest());
        return get(url.getRemarkList(topicId)).then(data => {
          dispatch(appActions.finishRequest());
          if (!data.error) {
            const { remarks, remarkIds, users } = convertToPlainStructure(data);
            dispatch(fetchRemarksSuccess(topicId, remarkIds, remarks, users));
          } else {
            dispatch(appActions.setError(data.error));
          }
        });
      }
    };
  },
  createRemark: remark => {
    return dispatch => {
      dispatch(appActions.startRequest());
      return post(url.createRemark(), remark).then(data => {
        dispatch(appActions.finishRequest());
        if (!data.error) {
          dispatch(createRemarkSuccess(data.topic, data));
        } else {
          dispatch(appActions.setError(data.error));
        }
      });
    };
  }
};

const fetchRemarksSuccess = (topicId, remarkIds, remarks, users) => ({
  type: types.FETCH_REMARKS,
  topicId,
  remarkIds,
  remarks,
  users
});

const createRemarkSuccess = (topicId, remark) => ({
  type: types.CREATE_REMARK,
  topicId,
  remark
});

const shouldFetchRemarks = (topicId, state) => {
  const remarkIds = state.getIn(["remarks", "byTopic", topicId]);
  return !remarkIds;
};

const convertToPlainStructure = remarks => {
  let remarksById = {};
  let remarkIds = [];
  let authorsById = {};
  remarks.forEach(item => {
    remarksById[item.id] = { ...item, author: item.author.id };
    remarkIds.push(item.id);
    if (!authorsById[item.author.id]) {
      authorsById[item.author.id] = item.author;
    }
  });
  return {
    remarks: remarksById,
    remarkIds,
    users: authorsById
  };
};

// reducers
const byTopic = (state = Immutable.fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_REMARKS:
      return state.merge({ [action.topicId]: action.remarkIds });
    case types.CREATE_REMARK:
      return state.set(
        action.topicId,
        state.get(action.topicId).unshift(action.remark.id)
      );
    default:
      return state;
  }
};

const byId = (state = Immutable.fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_REMARKS:
      return state.merge(action.remarks);
    case types.CREATE_REMARK:
      return state.merge({ [action.remark.id]: action.remark });
    default:
      return state;
  }
};

const reducer = combineReducers({
  byTopic,
  byId
});

export default reducer;

// selectors
export const getRemarkIdsByTopic = (state, topicId) =>
  state.getIn(["remarks", "byTopic", topicId]);

export const getRemarks = state => state.getIn(["remarks", "byId"]);

