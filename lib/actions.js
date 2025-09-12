'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'

export async function createTransaction(formData) {
    // TODO: Validate Data

    const { error } = await (await createClient()).from('transactions').insert(formData)
    if (error) {
        throw new Error('Failed creating the transaction')
    }

    revalidatePath('/dashboard')
}
