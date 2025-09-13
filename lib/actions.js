'use server'

import { revalidatePath } from 'next/cache'
import { transactionSchema } from './validation'
import { createClient } from '@/lib/supabase/server'

export async function createTransaction(formData) {
    const validated = transactionSchema.safeParse(formData)

    if (!validated.success) {
        throw new Error('Invalid data')
    }

    const { error } = await (await createClient()).from('transactions').insert(validated.data)

    if (error) {
        throw new Error('Failed creating the transaction')
    }

    revalidatePath('/dashboard')
}

export async function fetchTransaction(range, offset = 0, limit = 10) {
    const supabase = createClient()

    let { data, error } = await (
        await supabase
    ).rpc('fetch_transactions', {
        limit_arg: limit,
        offset_arg: offset,
        range_arg: range,
    })
    if (error) {
        throw new Error("We can't fetch transactions")
    }
    return data
}
