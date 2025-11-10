import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFounderCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isFounder, setIsFounder] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFounderRole = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "founder")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // Not a founder, redirect to main app
          navigate("/chat");
          return;
        }

        setIsFounder(true);
      } catch (error) {
        console.error("Error checking founder role:", error);
        navigate("/chat");
      } finally {
        setLoading(false);
      }
    };

    checkFounderRole();
  }, [user, authLoading, navigate]);

  return { isFounder, loading };
};
