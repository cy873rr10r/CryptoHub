import React from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router is used
import './PrivacyPolicy.css'; // Custom styles

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <header className="privacy-header">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-date">Effective: January 22, 2026</p>
        <p className="privacy-intro">
          CryptoHub ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services related to cryptocurrency tracking, wallets, and analytics [web:3].
        </p>
      </header>

      <section className="privacy-section">
        <h2 className="section-title">1. Information We Collect</h2>
        <div className="section-content">
          <h3>Personal Information</h3>
          <ul>
            <li>Account Data: Name, email, username, and password when you create an account [web:1].</li>
            <li>KYC Data: Government ID, proof of address for compliance with regulations in crypto services [web:3].</li>
            <li>Wallet Addresses: Public blockchain addresses you connect for tracking portfolios.</li>
            <li>Payment Information: Details for premium subscriptions or transactions.</li>
          </ul>
          <h3>Automatically Collected</h3>
          <ul>
            <li>IP address, device type, browser info, and usage data via cookies [web:1].</li>
            <li>Cryptocurrency transaction history from connected wallets or APIs.</li>
          </ul>
          <h3>Third-Party Data</h3>
          <p>From blockchain explorers, exchanges, or analytics providers when you link accounts [web:5].</p>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">2. How We Use Your Information</h2>
        <div className="section-content">
          <ul>
            <li>Provide services: Portfolio tracking, alerts, and analytics.</li>
            <li>Security: Fraud detection, account protection using encryption (AES-256) [web:3].</li>
            <li>Compliance: KYC/AML for regulatory requirements.</li>
            <li>Marketing: Personalized emails (with opt-out).</li>
            <li>Improvement: Analyze usage to enhance features [web:1].</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">3. Sharing Your Information</h2>
        <div className="section-content">
          <ul>
            <li>Service Providers: Hosting, analytics (e.g., Google Analytics), bound by contracts [web:1].</li>
            <li>Legal: To authorities for compliance or subpoenas.</li>
            <li>Affiliates: Within CryptoHub for operations.</li>
            <li>No selling: We do not sell your data to third parties [web:3].</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">4. Data Security</h2>
        <div className="section-content">
          <p>We use encryption for data in transit and at rest, access controls, and regular audits. Private keys and seeds are never stored by us—only public data [web:3].</p>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">5. Your Rights</h2>
        <div className="section-content">
          <ul>
            <li>Access, correct, or delete your data via account settings or email support@cryptohub.com.</li>
            <li>Opt-out of cookies or marketing.</li>
            <li>EEA/UK: GDPR rights including portability [web:1].</li>
            <li>California: CCPA rights to know, delete, opt-out of sale (we don't sell) [web:1].</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">6. Cookies and Tracking</h2>
        <div className="section-content">
          <p>We use essential cookies for functionality and analytics cookies (opt-out available). No non-essential tracking without consent [web:1].</p>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">7. Children's Privacy</h2>
        <div className="section-content">
          <p>Services not for under 13. We do not knowingly collect data from children [web:1].</p>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">8. International Transfers</h2>
        <div className="section-content">
          <p>Data processed in the US and other locations with safeguards like Standard Contractual Clauses [web:1].</p>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">9. Changes to Policy</h2>
        <div className="section-content">
          <p>Updates posted here with notice for material changes.</p>
        </div>
      </section>

      <footer className="privacy-footer">
        <p>Contact: privacy@cryptohub.com | <Link to="/terms">Terms of Service</Link></p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
