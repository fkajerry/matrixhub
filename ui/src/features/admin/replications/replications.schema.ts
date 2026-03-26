import { z } from 'zod'

export const DEFAULT_REPLICATIONS_PAGE = 1
export const DEFAULT_REPLICATIONS_PAGE_SIZE = 10

export const replicationsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().catch(DEFAULT_REPLICATIONS_PAGE),
  query: z.string().trim().optional().catch(undefined),
})

export type ReplicationsSearch = z.infer<typeof replicationsSearchSchema>
