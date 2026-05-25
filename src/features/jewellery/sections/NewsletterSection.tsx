import { useState } from 'react';
import { toast } from 'sonner';
import { contactApi } from '@/api/contact';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactApi.subscribeNewsletter(email);
      toast.success("You're subscribed! Check your inbox for your 15% discount.");
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-accent py-14">
      <div className="henig-container text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-accent-foreground mb-2">
          Sign Up To Our Newsletter
        </h2>
        <p className="text-sm text-accent-foreground/70 mb-8">
          Get 15% off your first order and be the first to hear about new collections and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-accent-foreground/10 border border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/50 text-sm rounded-sm focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? 'Subscribing...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
