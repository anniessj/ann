import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { BotStats, BotStatus, CommandInfo, ConnectInput, ConnectResult, GroupInfo, HealthStatus, LogEntry, SimpleResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBotStatusUrl: () => string;
/**
 * @summary Get bot connection status
 */
export declare const getBotStatus: (options?: RequestInit) => Promise<BotStatus>;
export declare const getGetBotStatusQueryKey: () => readonly ["/api/bot/status"];
export declare const getGetBotStatusQueryOptions: <TData = Awaited<ReturnType<typeof getBotStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBotStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBotStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getBotStatus>>>;
export type GetBotStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get bot connection status
 */
export declare function useGetBotStatus<TData = Awaited<ReturnType<typeof getBotStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getConnectBotUrl: () => string;
/**
 * @summary Connect bot with phone number (pairing code)
 */
export declare const connectBot: (connectInput: ConnectInput, options?: RequestInit) => Promise<ConnectResult>;
export declare const getConnectBotMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof connectBot>>, TError, {
        data: BodyType<ConnectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof connectBot>>, TError, {
    data: BodyType<ConnectInput>;
}, TContext>;
export type ConnectBotMutationResult = NonNullable<Awaited<ReturnType<typeof connectBot>>>;
export type ConnectBotMutationBody = BodyType<ConnectInput>;
export type ConnectBotMutationError = ErrorType<void>;
/**
* @summary Connect bot with phone number (pairing code)
*/
export declare const useConnectBot: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof connectBot>>, TError, {
        data: BodyType<ConnectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof connectBot>>, TError, {
    data: BodyType<ConnectInput>;
}, TContext>;
export declare const getDisconnectBotUrl: () => string;
/**
 * @summary Disconnect bot
 */
export declare const disconnectBot: (options?: RequestInit) => Promise<SimpleResult>;
export declare const getDisconnectBotMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof disconnectBot>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof disconnectBot>>, TError, void, TContext>;
export type DisconnectBotMutationResult = NonNullable<Awaited<ReturnType<typeof disconnectBot>>>;
export type DisconnectBotMutationError = ErrorType<unknown>;
/**
* @summary Disconnect bot
*/
export declare const useDisconnectBot: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof disconnectBot>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof disconnectBot>>, TError, void, TContext>;
export declare const getGetBotGroupsUrl: () => string;
/**
 * @summary Get list of groups where bot is active
 */
export declare const getBotGroups: (options?: RequestInit) => Promise<GroupInfo[]>;
export declare const getGetBotGroupsQueryKey: () => readonly ["/api/bot/groups"];
export declare const getGetBotGroupsQueryOptions: <TData = Awaited<ReturnType<typeof getBotGroups>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBotGroups>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBotGroupsQueryResult = NonNullable<Awaited<ReturnType<typeof getBotGroups>>>;
export type GetBotGroupsQueryError = ErrorType<unknown>;
/**
 * @summary Get list of groups where bot is active
 */
export declare function useGetBotGroups<TData = Awaited<ReturnType<typeof getBotGroups>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCommandsUrl: () => string;
/**
 * @summary Get all available commands
 */
export declare const getCommands: (options?: RequestInit) => Promise<CommandInfo[]>;
export declare const getGetCommandsQueryKey: () => readonly ["/api/bot/commands"];
export declare const getGetCommandsQueryOptions: <TData = Awaited<ReturnType<typeof getCommands>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCommands>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCommands>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCommandsQueryResult = NonNullable<Awaited<ReturnType<typeof getCommands>>>;
export type GetCommandsQueryError = ErrorType<unknown>;
/**
 * @summary Get all available commands
 */
export declare function useGetCommands<TData = Awaited<ReturnType<typeof getCommands>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCommands>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBotLogsUrl: () => string;
/**
 * @summary Get recent bot activity logs
 */
export declare const getBotLogs: (options?: RequestInit) => Promise<LogEntry[]>;
export declare const getGetBotLogsQueryKey: () => readonly ["/api/bot/logs"];
export declare const getGetBotLogsQueryOptions: <TData = Awaited<ReturnType<typeof getBotLogs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBotLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBotLogsQueryResult = NonNullable<Awaited<ReturnType<typeof getBotLogs>>>;
export type GetBotLogsQueryError = ErrorType<unknown>;
/**
 * @summary Get recent bot activity logs
 */
export declare function useGetBotLogs<TData = Awaited<ReturnType<typeof getBotLogs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBotStatsUrl: () => string;
/**
 * @summary Get bot statistics
 */
export declare const getBotStats: (options?: RequestInit) => Promise<BotStats>;
export declare const getGetBotStatsQueryKey: () => readonly ["/api/bot/stats"];
export declare const getGetBotStatsQueryOptions: <TData = Awaited<ReturnType<typeof getBotStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBotStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBotStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getBotStats>>>;
export type GetBotStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get bot statistics
 */
export declare function useGetBotStats<TData = Awaited<ReturnType<typeof getBotStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBotStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map