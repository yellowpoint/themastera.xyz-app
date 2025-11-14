import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — THE MASTERA',
  description:
    'How THE MASTERA collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Effective date: {new Date().getFullYear()}-01-01
        </p>
      </div>

      <div className="space-y-8 text-sm leading-6">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Overview</h2>
          <p className="text-muted-foreground">
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use THE MASTERA.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Information We Collect</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Account data such as name, email, and profile details</li>
            <li>Usage data like pages viewed, searches, and interactions</li>
            <li>Content you upload, purchase, review, or otherwise provide</li>
            <li>Technical data including IP address, device, and browser</li>
            <li>
              Cookies and similar technologies for preference and analytics
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">How We Use Information</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Provide, operate, and improve the platform</li>
            <li>Personalize content and recommendations</li>
            <li>Maintain safety, integrity, and prevent abuse</li>
            <li>Communicate service updates and transactional messages</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Data Retention</h2>
          <p className="text-muted-foreground">
            We retain personal data only as long as necessary for the purposes
            described, or as required by law. You may request deletion of your
            account; certain records may be kept to comply with obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies to remember preferences and understand how users
            engage with THE MASTERA. You can control cookies through your
            browser settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We may integrate services for payments, analytics, storage, or
            media. These services process data under their own policies and
            agreements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Your Rights</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Access, correct, or delete your personal data</li>
            <li>Export your data where technically feasible</li>
            <li>Object to or restrict certain processing</li>
            <li>Withdraw consent when processing is based on consent</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Contact</h2>
          <p className="text-muted-foreground">
            Questions about this policy:{' '}
            <a className="underline" href="mailto:support@themastera.xyz">
              support@themastera.xyz
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Changes</h2>
          <p className="text-muted-foreground">
            We may update this policy from time to time. Material changes will
            be communicated through the platform or by email when appropriate.
          </p>
        </section>
      </div>
    </div>
  )
}
