import Script from 'next/script'

export function TrustpilotWidget() {
  const businessUnitId = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID
  const templateId = process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID
  if (!businessUnitId || !templateId) return null
  return (
    <>
      <Script src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" strategy="afterInteractive" />
      <div className="trustpilot-widget" data-locale="en-US" data-template-id={templateId} data-businessunit-id={businessUnitId} data-style-height="52px" data-style-width="100%">
        <a href="https://www.trustpilot.com/" target="_blank" rel="noreferrer">Trustpilot</a>
      </div>
    </>
  )
}
