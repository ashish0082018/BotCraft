import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        authUserDetails:null
    },
    reducers:{
       
        setauthUserDetail:(state,action)=>{
            state.authUserDetails=action.payload
        },
        
        logout:(state)=>{
            state.authUserDetails=null
        }

    }
});

export const {setauthUserDetail, logout}=userSlice.actions;
export default userSlice.reducer;