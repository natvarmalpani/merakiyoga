
import { supabase } from './supabaseClient';
import { PricingPlan } from '../types';

export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) throw new Error(error.message);
  
  // Convert DB bigint ID to string for frontend type compatibility if needed
  return (data || []).map((plan: any) => ({
    ...plan,
    id: plan.id.toString()
  }));
};

export const createPricingPlan = async (plan: Omit<PricingPlan, 'id'>): Promise<PricingPlan> => {
  const { data, error } = await supabase
    .from('pricing_plans')
    .insert([plan])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return {
    ...data,
    id: data.id.toString()
  };
};

export const updatePricingPlan = async (id: string, plan: Partial<PricingPlan>): Promise<PricingPlan> => {
  const { data, error } = await supabase
    .from('pricing_plans')
    .update(plan)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return {
    ...data,
    id: data.id.toString()
  };
};

export const deletePricingPlan = async (id: string) => {
  const { error } = await supabase
    .from('pricing_plans')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};
