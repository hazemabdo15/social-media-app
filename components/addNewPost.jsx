import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const AddNewPost = ({ onAddPost }) => {
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();

  const handleAddPost = async () => {
    if (!postContent.trim()) {
      Alert.alert("Empty Post", "Please write something before posting.");
      return;
    }

    if (!user) {
      Alert.alert("Authentication Error", "You must be logged in to post.");
      return;
    }

    setIsPosting(true);

    try {
      const newPost = {
        authorName: user.displayName || "Anonymous",
        content: postContent.trim(),
        uid: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await onAddPost(newPost);

      setPostContent("");
    } catch (error) {
      console.error("Error adding post:", error);
      Alert.alert("Error", "Failed to add post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const isPostValid = postContent.trim().length > 0 && !isPosting;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "A"}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.displayName || "Anonymous"}
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#636e72"
          value={postContent}
          onChangeText={setPostContent}
          multiline
          maxLength={500}
          editable={!isPosting}
        />

        <View style={styles.inputFooter}>
          <Text style={styles.characterCount}>{postContent.length}/500</Text>

          <TouchableOpacity
            style={[
              styles.postButton,
              !isPostValid && styles.postButtonDisabled,
            ]}
            onPress={handleAddPost}
            disabled={!isPostValid}
          >
            <Text
              style={[
                styles.postButtonText,
                !isPostValid && styles.postButtonTextDisabled,
              ]}
            >
              {isPosting ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0984e3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#dfe6e9",
    paddingTop: 12,
  },
  textInput: {
    fontSize: 16,
    color: "#2d3436",
    lineHeight: 22,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: "#636e72",
  },
  postButton: {
    backgroundColor: "#0984e3",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#b2b2b2",
    opacity: 0.6,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  postButtonTextDisabled: {
    color: "#ccc",
  },
});

export default AddNewPost;
