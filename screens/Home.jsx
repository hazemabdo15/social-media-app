import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from "react-native";
import Post from "../components/post";
import AddNewPost from "../components/addNewPost";
import { onAddPost } from "../utils/firestoreOperations";
import { useRealTimePosts } from "../hooks/useRealTimePosts";

const Home = () => {
  const { posts, loading, error } = useRealTimePosts();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddPost = async (newPost) => {
    try {
      await onAddPost(newPost);
    } catch (error) {
      Alert.alert("Error", "Failed to add post. Please try again.");
    }
  };

  const renderPost = ({ item }) => <Post post={item} />;

  const renderHeader = () => (
    <AddNewPost onAddPost={handleAddPost} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>Be the first to share something!</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load posts</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0984e3"
            colors={["#0984e3"]}
          />
        }
        contentContainerStyle={[
          styles.contentContainer,
          posts.length === 0 && styles.emptyContentContainer
        ]}
        showsVerticalScrollIndicator={false}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0984e3" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#636e72",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#b2bec3",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d63031",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(248, 249, 250, 0.8)",
  },
});

export default Home;
