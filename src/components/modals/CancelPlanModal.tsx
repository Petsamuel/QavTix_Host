"use client";

import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { FAQ_PAGE } from "@/enums/navigation";
import { cancelSubscription } from "@/actions/settings/client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showAlert } from "@/lib/redux/slices/alertSlice";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import ActionButton1 from "../custom-utils/buttons/ActionBtn1";

// ─── Feature definitions per plan ────────────────────────────────────────────

const PRO_LEFT_FEATURES = [
	{ icon: "hugeicons:calendar-add-01", label: "Unlimited Event Creation" },
	{ icon: "hugeicons:analytics-01", label: "Unlimited Ticket Categories" },
	{ icon: "hugeicons:chart-column", label: "Max Ticket Sales (2,500 tickets)" },
	{ icon: "hugeicons:discount", label: "Exclusive Discount Codes (Up to 100)" },
	{ icon: "hugeicons:user-multiple", label: "Referral Sales Program" },
	{ icon: "hugeicons:settings-02", label: "Advanced Event Setup" },
	{ icon: "hugeicons:user-add-01", label: "Team Permissions (1 Team Member)" },
];

const PRO_RIGHT_FEATURES = [
	{ icon: "hugeicons:user-id-verification", label: "QR Code Check-In System" },
	{ icon: "hugeicons:dollar-circle", label: "Real-Time Sales Insights" },
	{ icon: "hugeicons:analytics-up", label: "Revenue Performance Chart" },
	{ icon: "hugeicons:dashboard-browsing", label: "Integrated Marketing Dashboard" },
	{ icon: "hugeicons:mail-account-01", label: "Priority Email Support" },
	{ icon: "hugeicons:alert-02", label: "Fraud Detection" },
	{ icon: "hugeicons:mail-open", label: "Built-in Email Campaigns (400 Sends/Month)" },
];

const ENTERPRISE_LEFT_FEATURES = [
	{ icon: "hugeicons:calendar-add-01", label: "Unlimited Event Creation" },
	{ icon: "hugeicons:analytics-01", label: "Unlimited Ticket Categories" },
	{ icon: "hugeicons:chart-column", label: "Unlimited Resale Volume" },
	{ icon: "hugeicons:discount", label: "Exclusive Discount Codes (Up to 500)" },
	{ icon: "hugeicons:user-multiple", label: "Referral Sales Program" },
	{ icon: "hugeicons:settings-02", label: "Advanced Event Setup" },
	{ icon: "hugeicons:user-add-01", label: "Team Permissions (3 Team Members)" },
	{ icon: "hugeicons:download-04", label: "Unlimited downloadable Attendee List" },
	{ icon: "hugeicons:profile-02", label: "Customer Profile Insights" },
	{ icon: "hugeicons:user-id-verification", label: "QR Code Check-In System" },
	{ icon: "hugeicons:megaphone-02", label: "Included Featured Event Listing (2 Weeks)" },
];

const ENTERPRISE_RIGHT_FEATURES = [
	{ icon: "hugeicons:dollar-circle", label: "Real-Time Sales Insights" },
	{ icon: "hugeicons:analytics-up", label: "Revenue Performance Chart" },
	{ icon: "hugeicons:location-03", label: "Geographical Breakdown" },
	{ icon: "hugeicons:chart-breakout-square", label: "Week-Based Analysis" },
	{ icon: "hugeicons:dashboard-browsing", label: "Integrated Marketing Dashboard" },
	{ icon: "hugeicons:mail-open", label: "Built-in Email Campaigns (400 Sends/Month)" },
	{ icon: "hugeicons:mail-account-01", label: "Sponsored Email Campaign" },
	{ icon: "hugeicons:contact-book", label: "Dedicated Account Manager" },
	{ icon: "hugeicons:customer-support", label: "Priority Customer Support" },
	{ icon: "hugeicons:alert-02", label: "Fraud Detection" },
];

const PLAN_FEATURES: Record<"pro" | "enterprise", { left: typeof PRO_LEFT_FEATURES; right: typeof PRO_RIGHT_FEATURES }> = {
	pro: { left: PRO_LEFT_FEATURES, right: PRO_RIGHT_FEATURES },
	enterprise: { left: ENTERPRISE_LEFT_FEATURES, right: ENTERPRISE_RIGHT_FEATURES },
};

const PLAN_DISPLAY_NAME: Record<"pro" | "enterprise", string> = {
	pro: "QavTix Professional Plan",
	enterprise: "QavTix Enterprise Plan",
};

// ─── Sub-component ────────────────────────────────────────────────────────────

const FeatureItem = ({ icon, label }: { icon: string; label: string }) => (
	<li className="flex items-start gap-2.5">
		<Icon
			icon={icon}
			width={18}
			height={18}
			className="mt-0.5 shrink-0 text-brand-accent-7"
		/>
		<span className="text-xs text-brand-secondary-7 leading-snug">{label}</span>
	</li>
);


interface CancelSubscriptionModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	planSlug: "pro" | "enterprise";
	expiresAt: string
}


export default function CancelSubscriptionModal({
	isOpen,
	setIsOpen,
	planSlug,
	expiresAt
}: CancelSubscriptionModalProps) {

	const dispatch = useAppDispatch();
	const [isCancelling, setIsCancelling] = useState(false);

	const handleClose = () => setIsOpen(false);

	const handleConfirm = async () => {
		setIsCancelling(true);
		const result = await cancelSubscription();
		if (result?.success) {
			dispatch(showAlert({
				variant: "success",
				title: "Subscription cancelled successfully",
				description: "Your subscription will remain active until the end of your billing period.",
				duration: 5000,
			}));
			handleClose();
		} else {
			dispatch(showAlert({
				variant: "destructive",
				title: "Failed to cancel subscription",
				description: "Something went wrong. Please try again.",
				duration: 5000,
			}));
		}
		setIsCancelling(false);
	};

	const features = PLAN_FEATURES[planSlug];
	const planName = PLAN_DISPLAY_NAME[planSlug];

	return (
		<AnimatedDialog
			open={isOpen}
			showCloseButton={false}
			className="md:max-w-lg p-0"
		>
			{/* Luggage illustration */}
			<div className="flex justify-center mb-4">
				<div className="relative w-24 h-28">
					<Image
						src="/images/vectors/suitcase.svg"
						alt="Sad luggage illustration"
						width={96}
						height={112}
						className="w-auto h-auto"
						priority
					/>
				</div>
			</div>

			{/* Header */}
			<DialogHeader className="text-center flex flex-col items-center mb-4">
				<DialogTitle className={cn(space_grotesk.className, "text-xl md:text-2xl font-bold text-brand-secondary-10")}>
					We&apos;re sorry to see you go
				</DialogTitle>
				<DialogDescription className="text-sm text-center text-brand-secondary-6 max-w-sm mt-1">
					By canceling your{" "}
					<span className="font-semibold text-brand-secondary-8">{planName}</span>
					, you&apos;ll miss out on premium productivity features including:
				</DialogDescription>
			</DialogHeader>

			{/* Feature grid */}
			<div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-5 mt-8">
				<ul className="flex flex-col gap-2.5">
					{features.left.map((f) => (
						<FeatureItem key={f.label} {...f} />
					))}
				</ul>
				<ul className="flex flex-col gap-2.5">
					{features.right.map((f) => (
						<FeatureItem key={f.label} {...f} />
					))}
				</ul>
			</div>

			{/* Billing notice */}
			<p className="text-xs text-center text-brand-secondary-6 mb-6">
				You can continue to use all of these features until the end of your
				current billing period on{" "}
				<span className="font-medium text-brand-secondary-7">{format(new Date(expiresAt), "dd/MM/yyyy")}</span>
				.{" "}
				<Link
					href={FAQ_PAGE}
					className="text-brand-primary-6 font-semibold underline underline-offset-2 hover:text-brand-primary-7 transition-colors"
				>
					Learn more
				</Link>
			</p>

			{/* Actions */}
			<div className="flex mt-10 flex-col sm:flex-row items-center gap-3">
				<button
					onClick={handleClose}
					className="w-full flex-1 h-14 rounded-full border border-brand-neutral-7 bg-white px-5 py-2.5 text-sm font-medium text-brand-secondary-8 hover:bg-brand-neutral-8 transition-colors"
				>
					Nevermind, Let&apos;s keep it
				</button>

				<ActionButton1
					action={handleConfirm}
					isDisabled={isCancelling}
					isLoading={isCancelling}
					buttonText="Continue to cancel"
					buttonType="button"
					className="w-full flex-1 h-12 text-sm!"
					iconPosition="right"
					icon="formkit:arrowright"
				/>
			</div>
		</AnimatedDialog>
	);
}