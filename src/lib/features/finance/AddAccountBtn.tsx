import AddBankAccountForm from "@/components/custom-utils/withdrawal/AddBankAccountForm"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useState } from "react"

interface AddAccountBtnProps {
    className?: string
}

export default function AddAccountBtn({ className }: AddAccountBtnProps) {

    const [showAddAccountModal, setShowAddAccountModal] = useState(false)

    return (
        <>
            <button
                onClick={() => setShowAddAccountModal(true)}
                className={cn(
                    'flex items-center rounded-lg justify-between text-xs md:text-sm font-bold gap-2 bg-brand-primary-1 p-2',
                    'text-brand-primary-6 hover:text-brand-primary-7 hover:bg-brand-primary-2 transition-colors ease-in-out duration-200',
                    className
                )}
            >
                <span className="w-6 aspect-square rounded flex justify-center items-center text-white bg-brand-primary-3">
                    <Icon icon="lucide:plus" width="16" height="16" />
                </span>
                <span>Add Account Bank</span>
            </button>

            <AddBankAccountForm
                openAddAccountModal={showAddAccountModal}
                setOpenAddAccountModal={setShowAddAccountModal}
            />
        </>
    )
}