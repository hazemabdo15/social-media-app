import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";

export const useRealTimePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { posts, loading, error };
};