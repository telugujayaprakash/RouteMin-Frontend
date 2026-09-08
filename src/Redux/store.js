import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//Reducers
import AuthReducer from './Auth/AuthSlice'
import FactoryReducer from './Factory/FactorySlice'
import WarehouseReducer from './Warehouse/WarehouseSlice'
import ReportsReducer from './Reports/ReportSlice'
import OptimizationReducer from './Optimisation/OptimisationSlice'
import AuditLogsReducer from './AuditLogs/AuditSlice'
import DashboardReducer from './Dashboard/DashboardSlice'
import paymentReducer from './Payments/PaymentSlice'

const rootReducer = combineReducers({
    Auth: AuthReducer,
    Factory: FactoryReducer,
    Warehouse: WarehouseReducer,
    Dashboard: DashboardReducer,
    Optimization: OptimizationReducer,
    Reports: ReportsReducer,
    AuditLogs: AuditLogsReducer,
    Payment: paymentReducer
})
const persistConfig = {
    key: 'root',
    storage: storage?.default ?? storage,
    whitelist: ['Auth'] //it only stores the login and signup data in localstorage
}
const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
)
export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)