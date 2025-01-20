import { configureStore } from "@reduxjs/toolkit";
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from './Reducers/authReducer';

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ['userToken'] // Only persist userToken
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;