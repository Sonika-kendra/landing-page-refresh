import { Award, Truck, Clock, Users, HeadphonesIcon } from 'lucide-react';

const features = [
  { icon: Award, title: 'Award Winning Supplier', desc: 'Constantly improving quality' },
  { icon: Truck, title: 'FREE Delivery', desc: 'For all website customers' },
  { icon: Clock, title: 'Same Day Dispatch', desc: 'On orders placed before 2pm' },
  { icon: Users, title: 'Representatives', desc: 'Covering the UK & Ireland' },
  { icon: HeadphonesIcon, title: 'Customer Service', desc: 'We pride ourselves on this' },
];

const ShopFeaturesBar = () => (
  <section className="bg-accent py-8 md:py-10">
    <div className="henig-container">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2">
            <Icon className="h-7 w-7 text-primary" />
            <h3 className="text-sm font-semibold text-accent-foreground">{title}</h3>
            <p className="text-xs text-accent-foreground/70">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopFeaturesBar;
