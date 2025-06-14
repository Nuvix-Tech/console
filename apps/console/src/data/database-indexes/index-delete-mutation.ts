import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { executeSql } from '../sql/execute-sql-query'
import type { ResponseError } from '@/types'
import { databaseIndexesKeys } from './keys'
import { ProjectSdk } from '@/lib/sdk'

export type DatabaseIndexDeleteVariables = {
    projectRef: string
    sdk: ProjectSdk
    name: string
}

export async function deleteDatabaseIndex({
    projectRef,
    sdk,
    name,
}: DatabaseIndexDeleteVariables) {
    const sql = `drop index if exists "${name}"`

    const { result } = await executeSql({
        projectRef,
        sdk,
        sql,
        queryKey: ['indexes'],
    })

    return result
}

type DatabaseIndexDeleteData = Awaited<ReturnType<typeof deleteDatabaseIndex>>

export const useDatabaseIndexDeleteMutation = ({
    onSuccess,
    onError,
    ...options
}: Omit<
    UseMutationOptions<DatabaseIndexDeleteData, ResponseError, DatabaseIndexDeleteVariables>,
    'mutationFn'
> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<DatabaseIndexDeleteData, ResponseError, DatabaseIndexDeleteVariables>(
        {
            mutationFn: (vars) => deleteDatabaseIndex(vars),
            async onSuccess(data, variables, context) {
                const { projectRef } = variables
                await queryClient.invalidateQueries({ queryKey: databaseIndexesKeys.list(projectRef) })
                await onSuccess?.(data, variables, context)
            },
            async onError(data, variables, context) {
                if (onError === undefined) {
                    toast.error(`Failed to delete database index: ${data.message}`)
                } else {
                    onError(data, variables, context)
                }
            },
            ...options,
        }
    )
}