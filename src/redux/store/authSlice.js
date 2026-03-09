import { createSlice } from "@reduxjs/toolkit" // per creare stato iniziale, reducers e azioni

// lo stato iniziale: l'utente è null, il token o viene recuperato dal local storage o è null
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  // le azioni che possono modificare lo stato: il login, il logout ed il setUser
  reducers: {
    // salva lo user ed il token in redux, ed il token anche in localStorage
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      localStorage.setItem("token", action.payload.token)
    },
    // cancella lo user ed il token per il logout
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("token")
    },
    // aggiorna l'utente
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { loginSuccess, logout, setUser } = authSlice.actions
export default authSlice.reducer
