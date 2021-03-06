# @promotively/react-redux-data

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://badge.fury.io/js/%40promotively%2Freact-redux-data.svg)](https://badge.fury.io/js/%40promotively%2Freact-redux-data)
[![Coverage Status](https://coveralls.io/repos/github/promotively/react-redux-data/badge.svg)](https://coveralls.io/github/promotively/react-redux-data)
[![Build Status](https://codebuild.us-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZGRPblJsbXA4WWVDY0gyU0VnM0JaVDVkaUFTeGpzYnNLUlFqRGRWd0J2MnBKOHA5cCtUY1plZHUvczkwNy96QUlsL3JUb1JiRnZmWVVzOTk1bG5wTE5nPSIsIml2UGFyYW1ldGVyU3BlYyI6Imw3VVN2QnhvTkN6UFZaNmYiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://aws.amazon.com/codebuild)
[![GitHub Issues](https://img.shields.io/github/issues/promotively/react-redux-data.svg)](https://github.com/promotively/react-redux-data/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/promotively/react-redux-data.svg)](https://GitHub.com/promotively/react-redux-data/pull/)

Universal/isomorphic react.js/redux.js javascript/typescript library for data fetching.

## Why?

- You are already using redux.js in your app.
- You want an easy way to handle data fetching.
- You are building a new app and want to use redux.js to handle your data state.
- You have a bunch of repetitive data related react.js/redux.js boilerplate you wish didn't exist.
- You want a proper data abstraction layer but don't have the time to build one.
- You want to be able to debug your data through redux dev tools.
- You want to avoid an architecture that depends on some kind of global data fetching layer (ie: react-router-config).
- You need a library that is compatible with server side rendering.
- You need to interact with APIs that are not HTTP and/or JSON based.
- You want to refresh your data periodically through timers or events.
- You need access to your component props when fetching data for things like access tokens or configs.
- You need to share your data with external applications and/or tools.

## Installation

Requires **React 16.8.3 or later and Redux 7.0.0 or later.**

With Yarn

`yarn add @promotively/react-redux-data`

With NPM

`npm install @promotively/react-redux-data`

## Example

Advanced examples using higher order components and hooks rendered with nodejs and web browsers are available inside the `/example` folder.

Once you have executed `yarn build` go to the `dist/example` folder and from there you can run `node server.js` to see server side rendering from `localhost:3000` or open the `index.html` file to see client side rendering.

An example is also [available online](https://promotively-react-redux-data.s3-us-west-1.amazonaws.com/example/index.html).

## Documentation

The source code is documented using JSDoc syntax and documentation is generated using [jsdoc](https://github.com/jsdoc/jsdoc).

Once you have executed `yarn docs` documentation is available inside the `dist/docs` folder.

Documentation for the most recent release is also [available online](https://promotively-react-redux-data.s3-us-west-1.amazonaws.com/docs/index.html).

## Setup

Add `dataReducer` to your redux.js store and make sure that `redux-thunk` is also added to your store middleware.

```javascript
// store.js

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { dataReducer } from '@promotively/react-redux-data';
import thunk from 'redux-thunk';

const store = createStore(combineReducers({ data: dataReducer }), applyMiddleware(...[thunk]));

export default store;
```

## Usage

Wrap your component using `withData` and specify an id for your data and a function that returns a promise.

```javascript
// containers/users.js

import { withData } from '@promotively/react-redux-data';
import axios from 'axios';
import Users from '../components/users';

const fetchUsers = props => axios.get('http://localhost:3000/api/v1/users').then(response => response.data);

const UsersContainer = withData({
  id: 'users',
  action: fetchUsers
})(Users);

export default UsersContainer;
```

```javascript
// components/users.js

import React from 'react';

const Users = props => (
  <ul>
    {props.error ? <span>Error: {props.error}</span> : null}
    {props.loading ? <span>Loading, Please Wait...</span> : null}
    {props.users ? props.users.map(user => <li key={user.id}>{user.name}</li>) : null}
  </ul>
);

export default Users;
```

```javascript
// components/app.js

import React from 'react';

const App = props => <UsersContainer />;

export default App;
```

If you need to do server side rendering use `hydrateStore` with `<DataProvider />` to pre-fetch data before your app is rendered.

```javascript
// server.js

import App from './components/app';
import UsersContainer from './containers/users';
import express from 'express';
import { hydrateStore } from '@promotively/react-redux-data';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import store from './store';

const server = express();
const data = [];
const app = (
  <Provider store={store}>
    <DataProvider context={data}>
      <App />
    </DataProvider>
  </Provider>
);

server.get('/', async (req, res, next) => {
  try {
    await hydrateStore(app, store, data);
    res.send(renderToString(app));
  } catch (error) {
    next(error);
  }
});

server.listen(3000);
```

## API

### Redux Action Creators

| Function       | Arguments         | Description                                              |
| -------------- | ----------------- | -------------------------------------------------------- |
| `completeData` | (id, query, data) | Insert data into the store directly (good for caching!). |
| `loadingData`  | (id)              | Set the data loading state.                              |
| `errorData`    | (id, error)       | Set the data error state.                                |
| `destroyData`   | (id)              | Remove data from the store.                              |
| `fetchData`    | (id, promise)     | Resolve a promise and add the result to the store.       |

### React Container Component

| Function       | Description                                                                                                         | Props                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `DataProvider` | Container component primarily used with the hydrateStore function for pre-fetching data with server side rendering. | { completeData, data, error, errorData, fetchData, loading, loadingData, destroyData } |

### React Higher Order Component

| Function   | Arguments | Description                                 | Props                                                    |
| ---------- | --------- | ------------------------------------------- | -------------------------------------------------------- |
| `withData` | (options) | An object containing configuration options. | { id, action, data, destroy, error, fetchData, loading } |


### React Hook

| Function   | Arguments | Description                                 | Props                                                    |
| ---------- | --------- | ------------------------------------------- | -------------------------------------------------------- |
| `useData` | (id, options) | An object containing configuration options. | { id, action, data, destroy, error, fetchData, loading } |

### Redux Reducers

| Function      | Description                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| `dataReducer` | A redux.js reducer function to handle the state mutations during the data fetching lifecycle. |

### React Redux Selectors

| Function                    | Arguments | Description                                                      |
| --------------------------- | --------- | ---------------------------------------------------------------- |
| `createDataSelector`        | (id)      | Create a reselect.js selector function to get the current data.  |
| `createDataErrorSelector`   | (id)      | Create a reselect.js selector function to get the error state.   |
| `createDataLoadingSelector` | (id)      | Create a reselect.js selector function to get the loading state. |

### Utilities

| Function       | Arguments          | Description                                                                                                   |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `hydrateStore` | (app, store, data) | A function that is used with the <DataProvider /> component for pre-fetching data with server side rendering. |

## Build

All build artifacts can be found inside the `dist/lib` and `dist/example` folders after running `yarn build`.

## Linting

This library uses [@promotively/eslint-config](https://github.com/promotively/eslint-config) and [@promotively/eslint-config-react](https://github.com/promotively/eslint-config-react) for its ESLint configuration.

`yarn lint`

## Tests

This library has 100% unit test code coverage.

Code coverage is available inside the `dist/coverage` folder after running `yarn test`.

Code coverage for the most recent release is also [available online](https://promotively-react-redux-data.s3-us-west-1.amazonaws.com/tests/index.html).

## Feedback

Feedback is more than welcome via [GitHub](https://github.com/promotively), [Twitter](https://twitter.com/promotively) or our [Website](https://promotively.com).

## License

MIT
