import { createClient } from '@/lib/supabase/server'
import { CircleUser } from 'lucide-react'
import Image from 'next/image'

export default async function Avatar({ width = 32, height = 32 }) {
    // Get user
    // get signed url from supabase - 5 min
    // use image component, configure it with supabase domain
    // default
    const supabase = createClient()
    const {
        data: { user },
    } = await (await supabase).auth.getUser()
    // 60 * 5 = 5 minutes
    const { data: imageData, error } = await (await supabase).storage.from('avatars').createSignedUrl(user.user_metadata?.avatar, 60 * 5)

    if (error) {
        return <CircleUser className="w-6 h-6" />
    }

    console.log(imageData.signedUrl)

    return <Image src={imageData.signedUrl} width={width} height={height} alt="User avatar" className="rounded-full" />
}
