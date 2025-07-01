import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { addComment, deleteComment } from '../utils/firestoreOperations';

const CommentsModal = ({ visible, onClose, post }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('Empty Comment', 'Please write something before posting.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addComment(
        post.id,
        user.uid,
        user.displayName || 'Anonymous',
        commentText.trim()
      );
      setCommentText('');
      Alert.alert('Success', 'Comment added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTime = (date) => {
    const now = new Date();
    const commentDate = date?.toDate ? date.toDate() : new Date(date);
    const diff = now - commentDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return commentDate.toLocaleDateString();
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(post.id, commentId);
              Alert.alert('Success', 'Comment deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete comment. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#0984e3', '#6c5ce7', '#a29bfe', '#fd79a8', 
      '#fdcb6e', '#e17055', '#00b894', '#81ecec'
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.commentsContainer}>
          {post?.comments?.length > 0 ? (
            post.comments.map((comment, index) => (
              <View key={comment.id || index} style={styles.commentItem}>
                <View style={[styles.commentAvatar, { backgroundColor: getAvatarColor(comment.userName) }]}>
                  <Text style={styles.commentAvatarText}>
                    {comment.userName?.charAt(0)?.toUpperCase() || 'A'}
                  </Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.userName}</Text>
                    <Text style={styles.commentTime}>
                      {formatCommentTime(comment.createdAt)}
                    </Text>
                    {comment.userId === user?.uid && (
                      <Pressable
                        style={styles.deleteCommentButton}
                        onPress={() => handleDeleteComment(comment.id)}
                      >
                        <Text style={styles.deleteCommentText}>×</Text>
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment!</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={[styles.userAvatar, { backgroundColor: getAvatarColor(user?.displayName) }]}>
              <Text style={styles.userAvatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() ||
                 user?.email?.charAt(0)?.toUpperCase() ||
                 'A'}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Write a comment..."
              placeholderTextColor="#636e72"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={200}
              editable={!isSubmitting}
            />
          </View>
          <View style={styles.inputFooter}>
            <Text style={styles.characterCount}>{commentText.length}/200</Text>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!commentText.trim() || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#0984e3',
    fontWeight: '600',
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#636e72',
    flex: 1,
  },
  deleteCommentButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteCommentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  commentText: {
    fontSize: 14,
    color: '#2d3436',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#636e72',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b2bec3',
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 20,
    minHeight: 40,
    maxHeight: 80,
    textAlignVertical: 'top',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 44,
  },
  characterCount: {
    fontSize: 12,
    color: '#636e72',
  },
  submitButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#b2b2b2',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommentsModal;
