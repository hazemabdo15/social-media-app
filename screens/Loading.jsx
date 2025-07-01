import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';

const Loading = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;
    const slideValue = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 1.15,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const fadeAnimation = Animated.timing(fadeValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        });

        const slideAnimation = Animated.timing(slideValue, {
            toValue: 0,
            duration: 800,
            delay: 200,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
        });

        spinAnimation.start();
        pulseAnimation.start();
        fadeAnimation.start();
        slideAnimation.start();

        return () => {
            spinAnimation.stop();
            pulseAnimation.stop();
            fadeAnimation.stop();
            slideAnimation.stop();
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeValue }]}>
                <View style={styles.loadingSpinner}>
                    <Animated.View 
                        style={[
                            styles.outerRing, 
                            { transform: [{ rotate: spin }] }
                        ]} 
                    />
                    
                    <Animated.View 
                        style={[
                            styles.innerCircle, 
                            { transform: [{ scale: pulseValue }] }
                        ]} 
                    />
                    
                    <View style={styles.centerDot} />
                </View>
                
                <Animated.View 
                    style={[
                        styles.textContainer,
                        { transform: [{ translateY: slideValue }] }
                    ]}
                >
                    <Animated.Text 
                        style={[
                            styles.loadingText, 
                            { transform: [{ scale: pulseValue }] }
                        ]}
                    >
                        Loading...
                    </Animated.Text>
                    
                    <Text style={styles.subtitle}>
                        Setting up your experience
                    </Text>
                    
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.dot1]} />
                        <View style={[styles.dot, styles.dot2]} />
                        <View style={[styles.dot, styles.dot3]} />
                    </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 300,
    },
    loadingSpinner: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    outerRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#0984e3',
        borderRightColor: '#0984e3',
        position: 'absolute',
    },
    innerCircle: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        position: 'absolute',
    },
    centerDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0984e3',
        position: 'absolute',
        shadowColor: '#0984e3',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    loadingText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
        textAlign: 'center',
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0984e3',
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 1,
    },
})

export default Loading;
