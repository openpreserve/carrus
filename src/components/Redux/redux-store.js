import { createStore } from 'redux';
import { preproccessReducer } from './redux-reducers';

const store = createStore(preproccessReducer);

export default store;
