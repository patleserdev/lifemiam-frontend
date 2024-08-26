import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, regime: [], menu: null,list:[] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    token: (state, action) => {
      state.value.token = action.payload;
    },
    initRegimes: (state, action) => {
      state.value.regime = action.payload;
    },
    addRegime: (state, action) => {
     if (!state.value.regime.find((e)=> e === action.payload))
     {
      state.value.regime.push(action.payload);
      console.log("ajouter", action.payload);
     }
    },
    removeRegime: (state, action) => {
      state.value.regime = state.value.regime.filter(
        (e) => e !== action.payload
      );
      console.log("retirer", action.payload);
    },
    setMenu: (state, action) => {
      state.value.menu = action.payload
    },
    clearMenu: (state, action) => {
      state.value.menu = null
    },
    setList: (state, action) => {
      state.value.list = action.payload
    },

  },
});

export const { token, addRegime, removeRegime, initRegimes, setMenu, clearMenu,setList } =
  userSlice.actions;
export default userSlice.reducer;
