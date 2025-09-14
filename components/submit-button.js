import Button from '@/components/button'
import { Loader } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export default function SubmitButton(props) {
    const { pending } = useFormStatus()
    console.log(pending === undefined)

    return (
        <Button {...props} className={`${props.className} flex items-center space-x-2 justify-center`} disabled={pending}>
            {pending && <Loader className="animate-spin w-4 h-4" />}
            <span>{props.children}</span>
        </Button>
    )
}
