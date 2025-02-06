"use client";

import type * as React from "react";
import { useState } from "react";

interface NotificationDialogProps {
	errorCode?:
		| "user_rejected"
		| "generic_error"
		| "already_requested"
		| "permission_disabled"
		| "already_granted"
		| "unsupported_permission";
	onProceed?: () => void;
	onDecline?: () => void;
}

export function NotificationDialog({
	errorCode,
	onProceed,
	onDecline,
}: NotificationDialogProps) {
	const [isClosing, setIsClosing] = useState(false);

	const getErrorMessage = () => {
		switch (errorCode) {
			case "user_rejected":
				return "You have declined the permission request. You can change this in your settings.";
			case "generic_error":
				return "Something went wrong. Please try again later.";
			case "already_requested":
				return "You have already declined notifications once. You can enable them in your settings.";
			case "permission_disabled":
				return "Notifications are disabled for World App. Please enable them in your settings.";
			case "already_granted":
				return "You have already granted notification permissions to this mini app.";
			case "unsupported_permission":
				return "This permission is not supported yet. Please try again later.";
			default:
				return null;
		}
	};

	const handleProceed = () => {
		setIsClosing(true);
		void setTimeout(() => {
			onProceed?.();
		}, 150);
	};

	const handleDecline = () => {
		setIsClosing(true);
		void setTimeout(() => {
			onDecline?.();
		}, 150);
	};

	const errorMessage = getErrorMessage();

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-150 ${
				isClosing ? "opacity-0" : "opacity-100"
			}`}
		>
			<div
				className={`w-full max-w-[90%] transform rounded-[32px] bg-[#2C5154] shadow-xl transition-all duration-150
					sm:max-w-[440px]
					md:max-w-[480px]
					lg:max-w-[520px]
					${isClosing ? "scale-95" : "scale-100"}
					${errorMessage ? "p-6 sm:p-7 md:p-8" : "p-5 sm:p-6 md:p-7 lg:p-8"}`}
			>
				{errorMessage ? (
					<>
						<h2 className="mb-3 text-lg font-semibold text-[#E36C59] sm:mb-4 sm:text-xl md:text-2xl">
							Notification Error
						</h2>
						<p className="mb-5 text-sm text-white sm:mb-6 sm:text-base md:text-lg">
							{errorMessage}
						</p>
						<button
							type="button"
							onClick={handleProceed}
							className="w-full rounded-full bg-[#E36C59] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#E36C59]/90 focus:outline-none focus:ring-2 focus:ring-[#E36C59]/50 active:bg-[#E36C59]/80
								sm:px-5 sm:py-3 sm:text-base
								md:px-6 md:py-3.5 md:text-lg"
						>
							Got It
						</button>
					</>
				) : (
					<>
						<h2 className="mb-2 text-lg font-semibold text-[#E36C59] sm:text-xl md:text-2xl">
							Before you continue:
						</h2>
						<h3 className="mb-2 text-base font-medium text-white sm:text-lg md:mb-3 md:text-xl">
							Would you like to receive notifications from the MiniApp?
						</h3>
						<p className="mb-5 text-sm text-white/90 sm:mb-6 sm:text-base md:mb-7 md:text-lg">
							By clicking &quot;Yes, Proceed&quot; you agree to receive
							notifications about new test releases, reminders to check
							resources, and other important updates.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							{["Yes, Proceed", "No, Maybe Later"].map((text) => (
								<button
									key={text}
									type="button"
									onClick={
										text === "Yes, Proceed" ? handleProceed : handleDecline
									}
									className="flex-1 rounded-full bg-[#E36C59] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#E36C59]/90 focus:outline-none focus:ring-2 focus:ring-[#E36C59]/50 active:bg-[#E36C59]/80
										sm:px-5 sm:py-3 sm:text-base
										md:px-6 md:py-3.5 md:text-lg"
								>
									{text}
								</button>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
