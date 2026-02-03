import SectionHeader from '@/components/shared/SectionHeader';
import { certifications, jewellerAssociations } from '@/config/landing/theme';

const CertificationsSection = () => (
  <section className="py-24">
    <div className="henig-container">
      <SectionHeader caption="Jewellers Excellence" title="Certified for Your Clients" />
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {jewellerAssociations.map(a => <p key={a.name}>{a.name}</p>)}
        </div>
        <div>
          {certifications.map(c => <p key={c.name}>{c.name}</p>)}
        </div>
      </div>
    </div>
  </section>
);

export default CertificationsSection;