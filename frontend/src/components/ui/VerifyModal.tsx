'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FilledButton } from "@/components/ui/FilledButton"
import Image from "next/image"
import { useVerification } from "@/hooks/useVerification"

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => Promise<void>;
}

export function VerifyModal({ isOpen, onClose, onVerify }: VerifyModalProps) {
  const { isVerifying, error } = useVerification()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[368px] p-0 bg-[#2c5154] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-col items-center px-8 py-6">
          <Image
            src="/mindvault-logo.png"
            alt="Verify Icon"
            width={114}
            height={110}
            className="mb-4"
          />
          
          <h2 className="text-center text-white text-[32px] font-semibold mb-4">
            Not Verified yet?
          </h2>
          
          <p className="text-center text-white text-[15px] font-bold font-spaceGrotesk leading-[25px] mb-8">
            Find your closest Orb and completely verify your World ID!
            <br/><br/>
            By verifying you will have access to more features on the app and no ads.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <div className="flex justify-between w-full mt-auto">
            <FilledButton
              variant="default"
              size="sm"
              className="bg-[#e36c59] hover:bg-[#e36c59]/90 rounded-[30px] px-6"
              onClick={onClose}
            >
              Maybe Later
            </FilledButton>

            <FilledButton
              variant="default"
              size="sm"
              className="bg-[#e36c59] hover:bg-[#e36c59]/90 rounded-[20px] px-6"
              onClick={onVerify}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify!'}
            </FilledButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 