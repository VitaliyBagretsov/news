import { createSlice } from '@reduxjs/toolkit'
import { IMedia } from './types'

export interface NewsState {
  data: IMedia[]
}

const initialState: NewsState = {
  data: [],
}

export const newsSlice = createSlice({
  name: 'newsSlice',
  initialState,
  reducers: {
    loadMedia: (state, action) => {
      return {...state, data: action.payload?.data}
    }
  },
})

export const {
  loadMedia
} = newsSlice.actions;

export default newsSlice.reducer