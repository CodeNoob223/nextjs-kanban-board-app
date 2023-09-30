"use client";
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { signIn, signOut } from '@/store/slices/userDataSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export const AuthProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const supabase = createClientComponentClient<Database>();
  // create state values for user data and loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const {data, error} = await supabase.auth.getSession();

      if (error || data.session === null) {
        console.log("No user session found!");
        if (error) console.log(error);
        setLoading(false);
        return;
      }

      if (data.session?.user) {
        const userData = await supabase.from("profiles").select().eq("profile_id", data.session.user.id).single();
        if (userData.error) {
          console.log(userData.error);
          return;
        }

        if (userData.data) {
          store.dispatch(signIn({
            ...data.session.user,
            ...userData.data,
            projects: []
          }));
        }
      }
      setLoading(false);
    }

    getUserData();

    // listen for changes to auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await supabase.from("profiles").select().eq("profile_id", session.user.id).single();
          if (userData.data) {
            store.dispatch(signIn({
              ...session.user,
              ...userData.data,
              projects: []
            }));
          }
        } else {
          store.dispatch(signOut());
        }
        setLoading(false);
      }
    );
    // cleanup the useEffect hook
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);
  // use a provider to pass down the value
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
