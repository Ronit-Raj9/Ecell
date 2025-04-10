import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Import all the slices for reducers
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import teamReducer from './slices/teamSlice';
import resourceReducer from './slices/resourceSlice';
import announcementReducer from './slices/announcementSlice';
import galleryReducer from './slices/gallerySlice';

// Create storage for Next.js SSR compatibility
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    }
  };
};

const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage();

// Configure which parts of state should be persisted
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  events: eventReducer,
  gallery: galleryReducer,
  resources: resourceReducer,
  announcements: announcementReducer,
  team: teamReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>; 