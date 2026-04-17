import { checkPasswordStrength } from '@/helper-fns/checkPasswordStrength';
import { Icon } from '@iconify/react';
import { useMemo } from 'react'

interface PasswordStrengthIndicatorProps {
    password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {

    // Empty Password handling
    if (!password) return null;

    const strengthCheck = useMemo(() => {
        return checkPasswordStrength(password)
    }, [password])


    const { score, strength, color, label, atLeastOneUppercase, atLeastOneNumber, atLeastEightCharacters } = strengthCheck

    const requirements = [
        { label: 'At least 1 uppercase', met: atLeastOneUppercase },
        { label: 'At least 1 number', met: atLeastOneNumber },
        { label: 'At least 8 characters', met: atLeastEightCharacters }
    ]

    return (
        <div className="mt-10 space-y-3">
            {/* Progress Bars */}
            <div className="flex gap-2">
                {[1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: score >= index ? color : '#e5e5e5'
                        }}
                    />
                ))}
            </div>

            {/* Requirements Checklist */}
            {strength !== 'strong' && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-brand-neutral-7 my-5">
                        {label}
                    </p>
                    <ul className="space-y-1.5">
                        {requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2.5">
                                {req.met ? (
                                    <Icon icon="ph:seal-check-fill" width="24" height="24" className='text-[#3EC596]' />
                                ) : (
                                    <Icon icon="ph:seal-check-fill" width="24" height="24"  className='text-brand-neutral-5' />
                                )}
                                <span className="text-sm text-brand-neutral-7">
                                    {req.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {strength === 'strong' && (
                <div className="flex items-center gap-2">
                    <Icon icon="ph:seal-check-fill" width="24" height="24" className='text-[#3EC596]' />
                    <p className="text-sm font-medium text-[#3EC596]">
                        {label}
                    </p>
                </div>
            )}
        </div>

    )
}