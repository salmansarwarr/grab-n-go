import Navbar from "@/components/commons/Navbar/Navbar";
import Footer from "@/components/commons/Footer/Footer";
import Head from "next/head";
import {
  Users,
  Handshake,
  Route,
  Landmark,
  Target,
  DollarSign,
} from "lucide-react";

const steps = [
  {
    icon: Users,
    text: "Contact a Grab N Go Express representative",
  },
  {
    icon: Handshake,
    text: "Negotiate the lease terms",
  },
  {
    icon: Route,
    text: "Grab N Go Express takes care of permitting",
  },
  {
    icon: Landmark,
    text: "Grab N Go Express takes care of construction",
  },
  {
    icon: Target,
    text: "Grab N Go Express delivers unit and takes care of all maintenance",
  },
  {
    icon: DollarSign,
    text: "Collect rent, acquire customers, and increase profits",
  },
];

export default function PartnerWithUs() {
  return (
    <>
      <Head>
        <title>Partner With Us | Grab N Go Express</title>
        <meta
          name="description"
          content="Partner with Grab N Go Express and generate profits from unused space."
        />
      </Head>
      <Navbar />
      <section className="partner-hero">
        <div className="container">
          <h1 className="partner-title">
            Interested in having us as a tenant?
          </h1>
          <p className="partner-subtitle">
            Add additional income and increase capitalized value of your
            property.
          </p>
          <div className="partner-features">
            <div className="feature-block">
              <h2>No Human Contact</h2>
              <p>
                Our Direct-to-Consumer technology automates ready meal preps,
                eliminating all human contact.
              </p>
            </div>
            <div className="feature-block">
              <h2>No Cost to the Landlord</h2>
              <p>
                We do not require any tenant improvement allowance. We pay for
                the construction, permitting, and operation of the station.
              </p>
            </div>
            <div className="feature-block">
              <h2>Architectural Compatibility</h2>
              <p>
                Our modern food station can be color matched to your building
                facade to ensure aesthetic consistency.
              </p>
            </div>
            <div className="feature-block">
              <h2>Professional Maintenance</h2>
              <p>
                Our units are cleaned and sanitized daily by our trained
                technicians. Every location is computer monitored 24/7 for
                quality.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="partner-steps">
        <div className="container">
          <h1 className="steps-title">
            Generate bottom line profits from unused space.
          </h1>
          <div className="steps-list">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div className="step-block" key={idx}>
                  <div className="step-icon">
                    <Icon color="#ff8b00" size={90} strokeWidth={1.5} />
                  </div>
                  <div className="step-text">
                    <span className="step-number">{idx + 1}.</span> {step.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
