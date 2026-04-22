import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import LegalModal from './LegalModal'
import {
  PaymentTermsContent,
  PrivacyPolicyContent,
  RefundPolicyContent,
  ShippingPolicyContent,
  TermsAndConditionsContent,
} from './LegalContent'

const LegalContext = createContext(null)

const TITLES = {
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
  refund: 'Refund & Cancellation Policy',
  shipping: 'Shipping & Delivery Policy',
  payment: 'Payment Terms',
}

export function LegalModalsProvider({ children }) {
  const [active, setActive] = useState(
    /** @type {null | keyof typeof TITLES} */ (null),
  )

  const openTerms = useCallback(() => setActive('terms'), [])
  const openPrivacy = useCallback(() => setActive('privacy'), [])
  const openRefund = useCallback(() => setActive('refund'), [])
  const openShipping = useCallback(() => setActive('shipping'), [])
  const openPayment = useCallback(() => setActive('payment'), [])

  const onClose = useCallback(() => setActive(null), [])

  const value = useMemo(
    () => ({ openTerms, openPrivacy, openRefund, openShipping, openPayment }),
    [openPayment, openPrivacy, openRefund, openShipping, openTerms],
  )

  return (
    <LegalContext.Provider value={value}>
      {children}
      <LegalModal
        isOpen={active === 'terms'}
        onClose={onClose}
        title={TITLES.terms}
        titleId="legal-modal-terms"
      >
        <TermsAndConditionsContent />
      </LegalModal>
      <LegalModal
        isOpen={active === 'privacy'}
        onClose={onClose}
        title={TITLES.privacy}
        titleId="legal-modal-privacy"
      >
        <PrivacyPolicyContent />
      </LegalModal>
      <LegalModal
        isOpen={active === 'refund'}
        onClose={onClose}
        title={TITLES.refund}
        titleId="legal-modal-refund"
      >
        <RefundPolicyContent />
      </LegalModal>
      <LegalModal
        isOpen={active === 'shipping'}
        onClose={onClose}
        title={TITLES.shipping}
        titleId="legal-modal-shipping"
      >
        <ShippingPolicyContent />
      </LegalModal>
      <LegalModal
        isOpen={active === 'payment'}
        onClose={onClose}
        title={TITLES.payment}
        titleId="legal-modal-payment"
      >
        <PaymentTermsContent />
      </LegalModal>
    </LegalContext.Provider>
  )
}

export function useLegal() {
  const ctx = useContext(LegalContext)
  if (!ctx) {
    throw new Error('useLegal must be used within LegalModalsProvider')
  }
  return ctx
}
