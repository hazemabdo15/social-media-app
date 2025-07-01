import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { updatePost } from '../utils/firestoreOperations';

const EditPostModal = ({ visible, onClose, post }) => {
  const [content, setContent] = useState(post?.content || '');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (post?.content) {
      setContent(post.content);
    }
  }, [post]);

  const handleUpdate = async () => {
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      Alert.alert('Empty Post', 'Please write something before updating.');
      return;
    }

    if (trimmedContent === post?.content) {
      Alert.alert('No Changes', 'No changes were made to the post.');
      return;
    }

    setIsUpdating(true);

    try {
      await updatePost(post.id, trimmedContent);
      Alert.alert('Success', 'Post updated successfully!', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (content !== post?.content) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setContent(post?.content || '');
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  const isContentValid = content.trim().length > 0 && !isUpdating;
  const hasChanges = content.trim() !== post?.content;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Post</Text>
          <TouchableOpacity
            style={[
              styles.updateButton,
              (!isContentValid || !hasChanges) && styles.updateButtonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={!isContentValid || !hasChanges}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[
                styles.updateButtonText,
                (!isContentValid || !hasChanges) && styles.updateButtonTextDisabled,
              ]}>
                Update
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#636e72"
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={500}
              editable={!isUpdating}
              autoFocus
            />
            
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>
                {content.length}/500
              </Text>
            </View>
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
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#636e72',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  updateButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#b2b2b2',
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  updateButtonTextDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 22,
    minHeight: 120,
    maxHeight: 300,
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  characterCount: {
    fontSize: 12,
    color: '#636e72',
  },
});

export default EditPostModal;
