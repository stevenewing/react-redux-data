/**
 * promotively/react-redux-data
 *
 * @copyright Promotively (c) 2020
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @license MIT
 *
 * @see {@link https://promotively.com}
 * @see {@link https://github.com/promotively/react-redux-data}
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  DATA_COMPLETE,
  DATA_ERROR,
  DATA_LOADING,
  DATA_DESTROY,
  errorData,
  loadingData,
  completeData,
  fetchData,
  destroyData
} from 'actions/data';

const createMockStore = configureMockStore([thunk]);

const dataId = 'test';
const mockData = { test: true };
const mockQuery = {};
const mockError = new Error('test-error');
const createMockPromise = () => Promise.resolve(mockData);
const createMockPromiseWithError = () => Promise.reject(mockError);

describe('actions/data.js', () => {
  it('should handle fetching data using promises.', async () => {
    const mockStore = createMockStore();

    await mockStore.dispatch(fetchData(dataId, createMockPromise));

    const actions = mockStore.getActions();

    expect(actions[0]).toEqual({
      id: dataId,
      query: mockQuery,
      type: DATA_LOADING
    });

    expect(actions[1]).toEqual({
      data: mockData,
      id: dataId,
      query: mockQuery,
      type: DATA_COMPLETE
    });
  });

  it('should handle errors when fetching data.', async () => {
    const mockStore = createMockStore();

    try {
      await mockStore.dispatch(fetchData(dataId, createMockPromiseWithError));
      throw mockError;
    } catch (error) {
      const actions = mockStore.getActions();

      expect(actions[0]).toEqual({
        id: dataId,
        query: mockQuery,
        type: DATA_LOADING
      });

      expect(actions[1]).toEqual({
        error: mockError.message,
        id: dataId,
        type: DATA_ERROR
      });
    }
  });

  it('should handle setting the error state.', () => {
    expect(errorData(dataId, mockError)).toEqual({
      error: mockError.message,
      id: dataId,
      type: DATA_ERROR
    });
  });

  it('should handle setting the loading state.', () => {
    expect(loadingData(dataId, mockQuery)).toEqual({
      id: dataId,
      query: mockQuery,
      type: DATA_LOADING
    });
  });

  it('should handle setting the data state.', () => {
    expect(completeData(dataId, mockQuery, mockData)).toEqual({
      data: mockData,
      id: dataId,
      query: mockQuery,
      type: DATA_COMPLETE
    });
  });

  it('should remove fetched data', () => {
    expect(destroyData(dataId)).toEqual({
      id: dataId,
      type: DATA_DESTROY
    });
  });
});
