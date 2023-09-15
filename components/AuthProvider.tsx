"use client";
import React, { useState, useEffect} from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { signIn, signOut } from '@/store/slices/userDataSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addNotification } from '@/store/slices/notificationSlice';

export const AuthProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const supabase = createClientComponentClient();
  // create state values for user data and loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        localStorage.clear();
        store.dispatch(addNotification({
          content: error.message!,
          type: "error"
        }));
      }

      if (data.user) {
        const userData = await supabase.from("profiles").select().eq("user_id", data.user.id);
        if (userData.error) {
          localStorage.clear();
          return;
        }

        if (userData.data) {
          store.dispatch(signIn({
            ...data.user,
            ...userData.data[0]
          }));
        }
        setLoading(false);
      }

      if (isAuth) {
        getUserData();
      }
    }

    // listen for changes to auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await supabase.from("profiles").select().eq("user_id", session.user.id);
          if (userData.data) {
            store.dispatch(signIn({
              ...session.user,
              ...userData.data[0]
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
      {!loading && children}
    </Provider>
  );
};
