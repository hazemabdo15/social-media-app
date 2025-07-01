import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert,
  Animated,
  Pressable 
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, deletePost } from '../utils/firestoreOperations';
import CommentsModal from './CommentsModal';
import EditPostModal from './EditPostModal';

const Post = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likeAnimation] = useState(new Animated.Value(1));
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Initialize likes and comments from post data
    setLikeCount(post?.likesCount || post?.likes?.length || 0);
    setCommentCount(post?.commentsCount || post?.comments?.length || 0);
    setLiked(post?.likes?.includes(user?.uid) || false);
  }, [post, user]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = date?.toDate ? date.toDate() : new Date(date);
    const diff = now - postDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return postDate.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to like posts.');
      return;
    }

    if (isLiking) return; // Prevent double-tapping

    setIsLiking(true);

    // Animate the like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // Optimistic update
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

      // Update Firestore
      await toggleLike(post.id, user.uid);
      
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to comment on posts.');
      return;
    }
    
    setShowComments(true);
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(post.id);
              Alert.alert('Success', 'Post deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleOptions = () => {
    if (post?.uid === user?.uid) {
      Alert.alert(
        'Post Options',
        'What would you like to do?',
        [
          { text: 'Edit Post', onPress: () => setShowEditModal(true) },
          { text: 'Delete Post', onPress: handleDelete, style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Post Options',
        'What would you like to do?',
        [
          { text: 'Report Post', onPress: () => Alert.alert('Report', 'Report feature coming soon!'), style: 'destructive' },
          { text: 'Hide Post', onPress: () => Alert.alert('Hide', 'Hide feature coming soon!') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  if (!post) {
    return null;
  }

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(post.authorName) }]}>
            <Text style={styles.avatarText}>
              {post.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>
              {post.authorName || 'Anonymous'}
            </Text>
            <Text style={styles.timeStamp}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>
        <Pressable 
          style={styles.optionsButton}
          onPress={handleOptions}
          android_ripple={{ color: '#f1f2f6', borderless: true, radius: 20 }}
        >
          <Text style={styles.optionsText}>⋯</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.postText}>{post.content}</Text>
      </View>

      {(likeCount > 0 || commentCount > 0) && (
        <View style={styles.statsContainer}>
          {likeCount > 0 && (
            <Text style={styles.statsText}>
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </Text>
          )}
          {commentCount > 0 && (
            <Text style={styles.statsText}>
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </Text>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable 
          style={[styles.actionButton, liked && styles.actionButtonLiked]}
          onPress={handleLike}
          disabled={isLiking}
          android_ripple={{ color: '#fee2e2', borderless: false }}
        >
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <Text style={[styles.actionIcon, liked && styles.likedIcon]}>
              {liked ? '❤️' : '🤍'}
            </Text>
          </Animated.View>
          <Text style={[styles.actionText, liked && styles.likedText]}>
            Like
          </Text>
        </Pressable>

        <Pressable 
          style={styles.actionButton}
          onPress={handleComment}
          android_ripple={{ color: '#e3f2fd', borderless: false }}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable 
          style={styles.actionButton}
          onPress={handleShare}
          android_ripple={{ color: '#f3e5f5', borderless: false }}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>

      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />

      <EditPostModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
    </View>
  );
};

// Helper function to generate consistent avatar colors
const getAvatarColor = (name) => {
  const colors = [
    '#0984e3', '#6c5ce7', '#a29bfe', '#fd79a8', 
    '#fdcb6e', '#e17055', '#00b894', '#81ecec'
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  timeStamp: {
    fontSize: 12,
    color: '#636e72',
    fontWeight: '400',
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsText: {
    fontSize: 18,
    color: '#636e72',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#2d3436',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
    color: '#636e72',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  actionButtonLiked: {
    backgroundColor: 'rgba(220, 38, 127, 0.1)',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  likedIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#636e72',
    fontWeight: '500',
  },
  likedText: {
    color: '#dc267f',
    fontWeight: '600',
  },
});

export default Post;
