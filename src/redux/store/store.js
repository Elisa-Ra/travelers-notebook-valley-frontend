import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"

// esporto lo store globale di redux, faccio gestire auth da authReducer (che importerò da authSlice)
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
