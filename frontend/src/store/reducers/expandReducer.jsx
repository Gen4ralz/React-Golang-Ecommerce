import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  expandSidebar: true,
}

const expandSlice = createSlice({
  name: 'expandSidebar',
  initialState,
  reducers: {
    toggleSidebar(state, action) {
      state.expandSidebar = !state.expandSidebar
    },
  },
})

export const { toggleSidebar } = expandSlice.actions

export default expandSlice.reducer
