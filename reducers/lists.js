import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setList: (state, action) => {
      if (!state.value.find((e)=> e.menuId === action.payload.menuId))
     {
            state.value.push(action.payload) 
     }
    },
    updateList: (state, action) => {
      const index=state.value.findIndex((e)=> e.menuId === action.payload.menuId)
      // console.log('index in reducer',index)
      if(index >= 0)
      {
        // console.log('dispatched')
        state.value[index]=action.payload
      }
      else
      {
        // console.log('dispatched by push')
        state.value.push(action.payload)
      }
    }
  },
});

export const {setList,updateList,updateOneElementOfList } = listsSlice.actions;
export default listsSlice.reducer;
