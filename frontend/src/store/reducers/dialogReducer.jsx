import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: true,
  header: 'Error creating product',
  msgs: [
    {
      msg: 'Choose atleat 2 images.',
      type: 'error',
    },
    {
      msg: 'Choose atleast 2 images.',
      type: 'error',
    },
  ],
  link: {
    link: '',
    link_text: '',
  },
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showDialog(state, action) {
      state.show = true
      state.header = action.payload.header
      state.msgs = action.payload.msgs
      state.link = action.payload.link
    },
    hideDialog(state) {
      state.show = false
      state.header = ''
      state.msgs = []
      state.link = {}
    },
  },
})

export const { showDialog, hideDialog } = dialogSlice.actions

export default dialogSlice.reducer
