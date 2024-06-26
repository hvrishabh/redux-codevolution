const redux = require("redux");
const thunkMiddleware = require("redux-thunk");
const axios = require("axios");
const reduxLogger = require("redux-logger");
const logger = reduxLogger.createLogger();

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const initialState = {
  loading: false,
  users: [],
  error: "",
};
const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        // ...state,
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        // ...state,
        loading: false,
        users: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

// action creator
// action creator creates an action , but thunk middleware brings the ability for an action creator to return a function instead of an action object.
//

const fetchUsers = () => {
  // this function does not needs to be pure , it is allowed to have side effects , like async api calls,
  return function (dispatch) {
    dispatch(fetchUsersRequest);
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const users = response.data.map((user) => {
          return user.id;
        });

        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        dispatch(fetchUsersFailure(error));
      });
  };
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware.default));

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(fetchUsers());
