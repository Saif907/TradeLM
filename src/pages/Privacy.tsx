import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Database, Eye, FileText } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold m-0">Our Commitment to Privacy</h2>
              </div>
              <p>
                Your privacy is fundamental to us. This policy explains how we collect, use, protect, and handle your 
                data in compliance with global privacy standards including GDPR, ISO/IEC 27001, and the Indian DPDP Bill.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold m-0">Data Collection & Anonymization</h2>
              </div>
              
              <h3 className="text-xl font-semibold">What We Collect</h3>
              <ul>
                <li><strong>Trading Data:</strong> Ticker symbols, entry/exit prices, quantities, dates (day precision only), and notes</li>
                <li><strong>Chat History:</strong> Messages exchanged with the AI trading assistant</li>
                <li><strong>Account Information:</strong> Email address for authentication (stored separately, not linked to trading data)</li>
                <li><strong>Session Metadata:</strong> Timestamps rounded to day precision for analytics</li>
              </ul>

              <h3 className="text-xl font-semibold">Anonymization Methods</h3>
              <p>
                We implement <strong>pseudonymization</strong> to protect your identity:
              </p>
              <ul>
                <li>Random UUID generation for user identification in trading records</li>
                <li>HMAC-based hashing with server-side secret salts</li>
                <li>Separation of authentication data from behavioral data</li>
                <li>Timestamp precision limited to day-level only</li>
                <li>No IP address logging, device fingerprinting, or cross-site tracking</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold m-0">Security Measures</h2>
              </div>
              
              <h3 className="text-xl font-semibold">Encryption</h3>
              <ul>
                <li><strong>Data at Rest:</strong> AES-256 encryption for all sensitive database fields</li>
                <li><strong>Data in Transit:</strong> TLS 1.3 encryption for all network communications</li>
                <li><strong>Key Management:</strong> Secure key rotation and storage practices</li>
              </ul>

              <h3 className="text-xl font-semibold">Access Control</h3>
              <ul>
                <li>Row-Level Security (RLS) policies ensure users only access their own data</li>
                <li>Multi-factor authentication available for enhanced account security</li>
                <li>Regular security audits and penetration testing</li>
                <li>Automated vulnerability scanning and patch management</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold m-0">Your Rights</h2>
              </div>

              <h3 className="text-xl font-semibold">GDPR Rights (European Users)</h3>
              <ul>
                <li><strong>Right to Access:</strong> Request a copy of all data we hold about you</li>
                <li><strong>Right to Rectification:</strong> Correct any inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Delete your account and all associated data</li>
                <li><strong>Right to Data Portability:</strong> Export your data in machine-readable format</li>
                <li><strong>Right to Object:</strong> Opt-out of data processing for analytics</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              </ul>

              <h3 className="text-xl font-semibold">DPDP Rights (Indian Users)</h3>
              <ul>
                <li><strong>Right to Consent:</strong> Clear consent required before data collection</li>
                <li><strong>Right to Withdrawal:</strong> Withdraw consent at any time</li>
                <li><strong>Right to Correction:</strong> Update or correct your personal information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to Grievance Redressal:</strong> Contact us for privacy concerns</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold m-0">Data Retention & Deletion</h2>
              </div>
              
              <h3 className="text-xl font-semibold">Retention Policy</h3>
              <ul>
                <li>Active account data: Retained while your account is active</li>
                <li>Inactive accounts (180+ days): Automated notification before data archival</li>
                <li>Deleted accounts: Immediate anonymization of all data, permanent deletion within 30 days</li>
                <li>Audit logs: Retained for 90 days for security purposes only</li>
              </ul>

              <h3 className="text-xl font-semibold">How to Delete Your Data</h3>
              <p>
                You can request data deletion at any time through your account settings or by contacting us at{" "}
                <a href="mailto:privacy@example.com" className="text-primary hover:underline">
                  privacy@example.com
                </a>
                . All deletion requests are processed within 30 days.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">Data Sharing</h2>
              <p>
                We <strong>never sell</strong> your data to third parties. We only share data in these limited circumstances:
              </p>
              <ul>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                <li><strong>Service Providers:</strong> Trusted partners who help operate our service (under strict data protection agreements)</li>
                <li><strong>Legal Obligations:</strong> When required by law or to protect our legal rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (with 30 days advance notice)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">Compliance Certifications</h2>
              <ul>
                <li><strong>GDPR Compliant:</strong> Full compliance with EU General Data Protection Regulation</li>
                <li><strong>ISO/IEC 27001 Aligned:</strong> Security controls following international standards</li>
                <li><strong>DPDP Bill Compliant:</strong> Adherence to Indian Digital Personal Data Protection Bill</li>
                <li><strong>SOC 2 Type II:</strong> Annual third-party security audits</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your data rights, contact:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="m-0"><strong>Data Protection Officer</strong></p>
                <p className="m-0">Email: privacy@example.com</p>
                <p className="m-0">Response time: Within 48 hours</p>
              </div>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">Policy Updates</h2>
              <p>
                We may update this policy periodically. Users will be notified of material changes via email and 
                in-app notifications. Continued use after changes constitutes acceptance. Last updated:{" "}
                <strong>{new Date().toLocaleDateString()}</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
