import { db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment,
  deleteDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

// Add a new post
const onAddPost = async (newPost) => {
  try {
    const postData = {
      ...newPost,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "posts"), postData);
    console.log("Post added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

// Toggle like on a post
const toggleLike = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }
    
    const postData = postDoc.data();
    const likes = postData.likes || [];
    const isLiked = likes.includes(userId);
    
    if (isLiked) {
      // Remove like
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Add like
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likesCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    }
    
    return !isLiked; // Return new like status
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Add a comment to a post
const addComment = async (postId, userId, userName, commentText) => {
  try {
    const postRef = doc(db, "posts", postId);
    const comment = {
      id: Date.now().toString(), // Simple ID generation
      userId,
      userName,
      text: commentText,
      createdAt: new Date(), // Use regular Date instead of serverTimestamp in arrayUnion
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      commentsCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    
    console.log("Comment added successfully");
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment from a post
const deleteComment = async (postId, commentId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }
    
    const postData = postDoc.data();
    const comments = postData.comments || [];
    const commentToRemove = comments.find(comment => comment.id === commentId);
    
    if (!commentToRemove) {
      throw new Error("Comment not found");
    }
    
    await updateDoc(postRef, {
      comments: arrayRemove(commentToRemove),
      commentsCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    
    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Update a post
const updatePost = async (postId, updatedContent) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      content: updatedContent,
      updatedAt: serverTimestamp(),
    });
    
    console.log("Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export { 
  onAddPost, 
  toggleLike, 
  addComment, 
  deleteComment, 
  updatePost, 
  deletePost 
};
