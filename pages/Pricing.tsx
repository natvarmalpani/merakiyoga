
import React, { useEffect, useState } from 'react';
import { getPricingPlans } from '../services/pricingService';
import { PricingPlan } from '../types';
import { Check, Loader2, Info } from 'lucide-react';

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPricingPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to load pricing plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-sage-green" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl text-deep-green mb-4">Membership Plans</h1>
        <p className="text-gray-600 mb-8">Invest in your wellbeing.</p>
      </div>

      {plans.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Info size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No active plans</h3>
            <p className="text-gray-500 mt-2">Please contact us directly for membership information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
            <div 
                key={plan.id} 
                className={`relative bg-white rounded-2xl p-8 border ${plan.highlight ? 'border-sage-green shadow-xl scale-105 z-10' : 'border-gray-100 shadow-sm'} transition-all flex flex-col h-full`}
            >
                {plan.highlight && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sage-green text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Best Value
                    </span>
                )}
                <h3 className="font-serif text-2xl font-medium text-deep-green mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                    {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                            <Check size={16} className="text-sage-green mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-medium transition-colors mt-auto ${plan.highlight ? 'bg-deep-green text-white hover:bg-opacity-90' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    Choose Plan
                </button>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Pricing;
