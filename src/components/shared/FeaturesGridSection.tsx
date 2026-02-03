// FeaturesGridSection.tsx
import { motion } from 'framer-motion';
import {
    Palette,
    MessageCircle,
    RotateCcw,
    Shield,
    LucideIcon,
} from 'lucide-react';
import { features } from '@/config/landing/theme';

const iconMap: Record<string, LucideIcon> = {
    Palette,
    MessageCircle,
    RotateCcw,
    Shield,
};

const FeaturesGridSection = () => {
    return (
        <section className="py-4 md:py-6">
            <div className="henig-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="text-center"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                                {(() => {
                                    const IconComponent = iconMap[feature.icon];
                                    return IconComponent ? (
                                        <IconComponent className="w-5 h-5 text-primary" />
                                    ) : null;
                                })()}
                            </div>

                            <h3 className="font-serif text-lg text-foreground mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-muted leading-snug">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGridSection;
