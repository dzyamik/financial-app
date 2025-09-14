'use client'

import Button from '@/components/button'
import Separator from '@/components/separator'
import TransactionItem from '@/components/transaction-item'
import TransactionSummaryItem from '@/components/transaction-summary-item'
import { fetchTransaction } from '@/lib/actions'
import { groupAndSumTransactionsByDate } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { useState } from 'react'

export default function TransactionList({ range, initialTransactions }) {
    const LIMIT = 10
    const [transactions, setTransactions] = useState(initialTransactions)
    const [offset, setOffset] = useState(initialTransactions.length)
    const [buttonHidden, setButtonHidden] = useState(initialTransactions.length < LIMIT)
    const [loading, setLoading] = useState(false)
    const grouped = groupAndSumTransactionsByDate(transactions)

    const handleClick = async (e) => {
        setLoading(true)
        try {
            const nextTransactions = await fetchTransaction(range, offset, LIMIT)
            setButtonHidden(nextTransactions.length < LIMIT)
            setOffset((prevValue) => prevValue + LIMIT)
            setTransactions((prevTransactions) => [...prevTransactions, ...nextTransactions])
        } finally {
            setLoading(false)
        }
    }

    const handleRemoved = (id) => () => {
        setTransactions((prev) => [...prev].filter((t) => t.id !== id))
    }

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([date, { transactions, amount }]) => (
                <div key={date}>
                    <TransactionSummaryItem date={date} amount={amount} />
                    <Separator />
                    <section className="space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction.id}>
                                <TransactionItem {...transaction} onRemoved={handleRemoved(transaction.id)} />
                            </div>
                        ))}
                    </section>
                </div>
            ))}
            {transactions.length === 0 && <div className="text-center text-gray-400 dark:text-gray-500">No transactions found</div>}
            {!buttonHidden && (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={handleClick} disabled={loading}>
                        <div className="flex items-center space-x-1">
                            {loading && <Loader className="animate-spin" />}
                            <div>Load More</div>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
}
