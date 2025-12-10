import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — THE MASTERA',
  description: 'The terms governing your use of THE MASTERA.',
}

export default function TermsOfServicePage() {
  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Effective date: {new Date().getFullYear()}-01-01
        </p>
      </div>

      <div className="space-y-6 text-sm leading-6">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using THE MASTERA, you agree to these Terms. If you
            do not agree, do not use the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Accounts</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>
              You are responsible for your account and safeguarding credentials
            </li>
            <li>You must provide accurate information and keep it updated</li>
            <li>We may suspend or terminate accounts for violations</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Content and Licensing</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>You retain rights to content you upload</li>
            <li>
              You grant us a license to host, reproduce, and display your
              content to provide the service
            </li>
            <li>
              You must have the necessary rights to upload and share content
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Payments and Subscriptions</h2>
          <p className="text-muted-foreground">
            Paid features, memberships, or purchases may have additional terms.
            All charges are displayed before checkout and may be subject to
            taxes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Prohibited Conduct</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Illegal activities or rights infringement</li>
            <li>Harassment, hate speech, or abusive behavior</li>
            <li>Circumventing security, scraping, or unauthorized access</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Termination</h2>
          <p className="text-muted-foreground">
            We may terminate or suspend access immediately for violations. You
            may stop using the service at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Disclaimers</h2>
          <p className="text-muted-foreground">
            THE MASTERA is provided on an “as is” and “as available” basis
            without warranties of any kind to the extent permitted by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, THE MASTERA and its
            affiliates are not liable for indirect, incidental, or consequential
            damages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by applicable local laws where the service
            is provided, without regard to conflict of laws principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Changes</h2>
          <p className="text-muted-foreground">
            We may revise these Terms from time to time. Continued use after
            updates constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Contact</h2>
          <p className="text-muted-foreground">
            Contact us at{' '}
            <a className="underline" href="mailto:support@themastera.xyz">
              support@themastera.xyz
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
