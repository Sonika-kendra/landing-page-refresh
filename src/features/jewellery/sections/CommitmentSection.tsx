import { 
  FaGem, 
  FaBoxOpen, 
  FaClock, 
  FaUsers, 
  FaHandsHelping 
} from 'react-icons/fa';

const CommitmentSection = () => {
  const items = [
    {
      icon: <FaGem className="text-2xl md:text-3xl mb-2" />,
      title: 'Award Winning Supplier',
      subtitle: 'Constantly improving quality',
    },
    {
      icon: <FaBoxOpen className="text-2xl md:text-3xl mb-2" />,
      title: 'FREE Delivery',
      subtitle: 'For all website customers',
    },
    {
      icon: <FaClock className="text-2xl md:text-3xl mb-2" />,
      title: 'Same Day Dispatch',
      subtitle: 'On orders placed before 2pm',
    },
    {
      icon: <FaUsers className="text-2xl md:text-3xl mb-2" />,
      title: 'Representatives',
      subtitle: 'Covering the UK & Ireland',
    },
    {
      icon: <FaHandsHelping className="text-2xl md:text-3xl mb-2" />,
      title: 'Customer Service',
      subtitle: 'We pride ourselves on this',
    },
  ];

  return (
    <section className="py-10 bg-secondary section-ivory">
      <div className="max-w-7xl mx-auto px-2 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-14 sm:gap-24">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {item.icon}
            <h3 className="font-semibold mt-2 text-base whitespace-nowrap">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommitmentSection;
