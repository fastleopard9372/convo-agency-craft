
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import jobsReducer from './slices/jobsSlice'
import conversationsReducer from './slices/conversationsSlice'
import proposalsReducer from './slices/proposalsSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme']
}

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  jobs: jobsReducer,
  conversations: conversationsReducer,
  proposals: proposalsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
