import { supabase } from './supabaseClient.ts';
import { ClassSession } from '../types.ts';

// Fetch all class sessions
export const getSchedule = async (): Promise<ClassSession[]> => {
  const { data, error } = await supabase
    .from('class_sessions')
    .select('*')
    .order('created_at', { ascending: true }); // We'll handle day sorting in the UI

  if (error) {
    console.error('Error fetching schedule:', error.message);
    throw new Error(error.message);
  }

  // Map DB columns to Typescript Interface
  return (data || []).map((item: any) => ({
    id: item.id.toString(),
    day: item.day,
    time: item.time,
    classType: item.class_type, // Mapping snake_case DB to camelCase JS
    instructor: item.instructor,
    location: item.location,
    level: item.level
  }));
};

// Create a new session
export const createSession = async (session: Omit<ClassSession, 'id'>): Promise<ClassSession> => {
  const { data, error } = await supabase
    .from('class_sessions')
    .insert([{
      day: session.day,
      time: session.time,
      class_type: session.classType,
      instructor: session.instructor,
      location: session.location,
      level: session.level
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  return {
    id: data.id.toString(),
    day: data.day,
    time: data.time,
    classType: data.class_type,
    instructor: data.instructor,
    location: data.location,
    level: data.level
  };
};

// Update an existing session
export const updateSession = async (id: string, session: Partial<ClassSession>): Promise<ClassSession> => {
  const updatePayload: any = {};
  if (session.day) updatePayload.day = session.day;
  if (session.time) updatePayload.time = session.time;
  if (session.classType) updatePayload.class_type = session.classType;
  if (session.instructor) updatePayload.instructor = session.instructor;
  if (session.location) updatePayload.location = session.location;
  if (session.level) updatePayload.level = session.level;

  const { data, error } = await supabase
    .from('class_sessions')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Update failed: ${error.message}`);
  }

  return {
    id: data.id.toString(),
    day: data.day,
    time: data.time,
    classType: data.class_type,
    instructor: data.instructor,
    location: data.location,
    level: data.level
  };
};

// Delete a session
export const deleteSession = async (id: string) => {
  const { error } = await supabase
    .from('class_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};