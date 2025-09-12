import Skeleton from '@/components/skeleton'

export default function TrendFallback() {
    return (
        <div className="space-y-5 w-3/5 lg:w-full">
            <div>
                <Skeleton />
            </div>
            <div>
                <Skeleton />
            </div>
            <div className="flex space-x-2">
                <Skeleton />
                <Skeleton />
            </div>
        </div>
    )
}
