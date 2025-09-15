'use server'

import { revalidatePath } from 'next/cache'
import { transactionSchema } from './validation'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

export async function updateTransaction(id, formData) {
    const validated = transactionSchema.safeParse(formData)

    if (!validated.success) {
        throw new Error('Invalid data')
    }

    const { error } = await (await createClient()).from('transactions').update(validated.data).eq('id', id)

    if (error) {
        throw new Error('Failed updating the transaction')
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

export async function deleteTransaction(id) {
    const supabase = createClient()
    const { error } = await (await supabase).from('transactions').delete().eq('id', id)

    if (error) {
        throw new Error(`Could not delete the transaction ${id}`)
    }

    revalidatePath('/dashboard')
}

export async function login(prevState, formData) {
    const supabase = createClient()
    const email = formData.get('email')
    const { error } = await (
        await supabase
    ).auth.signInWithOtp({
        email: email,
        options: {
            shouldCreateUser: true,
        },
    })

    if (error) {
        return {
            error: true,
            message: 'Error authenticating!',
        }
    }

    return {
        message: `Email sent to ${email}`,
    }
}

export async function signOut() {
    const supabase = createClient()
    const { error } = await (await supabase).auth.signOut()
    redirect('/login')
}

export async function uploadAvatar(prevState, formData) {
    const supabase = createClient()
    const file = formData.get('file')

    // Original extension
    // File name would be generated
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    const { error } = await (await supabase).storage.from('avatars').upload(fileName, file)

    if (error) {
        return {
            error: true,
            message: 'Error uploading avatar',
        }
    }

    // Removing the old avatar
    const { data: userData, userError } = await (await supabase).auth.getUser()

    if (userError) {
        return {
            error: true,
            message: 'Something went wrong, try again',
        }
    }

    const avatar = userData.user.user_metadata.avatar

    if (avatar) {
        const { error } = await (await supabase).storage.from('avatars').remove([avatar])

        if (error) {
            return {
                error: true,
                message: 'Something went wrong, try again',
            }
        }
    }

    const { error: dataUpdateError } = await (
        await supabase
    ).auth.updateUser({
        data: {
            avatar: fileName,
        },
    })

    if (dataUpdateError) {
        return {
            error: true,
            message: 'Error associating the avatar with the user',
        }
    }

    return {
        message: 'Updated the user avatar',
    }
}
