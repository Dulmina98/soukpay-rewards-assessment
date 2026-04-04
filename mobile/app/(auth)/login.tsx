import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, StatusBar,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { Fonts } from "@/constants/fonts";
import ShieldIcon from '@/assets/icons/auth/shield.svg';
import LockIcon from '@/assets/icons/auth/lock.svg';

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleLogin = async () => {
        // client side validation
        setValidationError('');
        dispatch(clearError());

        if (!email || !password) {
            setValidationError('Email and password are required');
            return;
        }

        if (!validateEmail(email)) {
            setValidationError('Please enter a valid email address');
            return;
        }

        dispatch(loginUser({ email, password }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FBF8FF" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
            <View style={styles.inner}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Access your editorial vault</Text>

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="name@institution.com"
                    placeholderTextColor="#767684"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TouchableOpacity activeOpacity={0.5}
                    >
                        <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#767684"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPassword((v) => !v)}
                        activeOpacity={0.6}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#767684"
                        />
                    </TouchableOpacity>
                </View>

                {validationError ? (
                    <Text style={styles.error}>{validationError}</Text>
                ) : null}

                {/* Show API errors from Redux */}
                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Enter The Vault</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.reqAccessRow}>
                    <Text style={styles.reqAccessText}>New to the ecosystem? </Text>
                    <TouchableOpacity activeOpacity={0.5}

                    >
                        <Text style={styles.reqAccessBtnText}>Request Access</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.trustRow}>
                    <View style={styles.trustBadge}>
                        <ShieldIcon width={16} height={16} />
                        <Text style={styles.trustText}>AES-256</Text>
                    </View>
                    <View style={styles.trustBadge}>
                        <LockIcon width={16} height={16} />
                        <Text style={styles.trustText}>SIPC Protected</Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={styles.footerText}>© 2024 SoukPay Institutional. All Rights
                    Reserved.</Text>
                <View style={styles.footerBtnRow}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Text style={styles.footerBtnText}>Privacy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Text style={styles.footerBtnText}>Compliance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Text style={styles.footerBtnText}>Support</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF8FF',
        paddingHorizontal: 24,
        paddingVertical: 48
    },
    inner: {
        paddingHorizontal: 24,
        paddingVertical: 36,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 8
    },
    title: {
        fontSize: 30,
        lineHeight: 36,
        fontWeight: 'bold',
        color: '#00003C',
        fontFamily: Fonts.manrope.extraBold
    },
    subtitle: {
        fontSize: 16,
        color: '#464653',
        marginBottom: 48,
        marginTop: 10,
        lineHeight: 24,
        fontFamily: Fonts.inter.medium
    },
    inputLabelContainer: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 32
    },
    inputLabel: {
        textTransform: "uppercase",
        marginBottom: 8,
        fontSize: 12,
        color: '#464653',
        letterSpacing: 1.2,
        fontFamily: Fonts.inter.semiBold
    },
    input: {
        backgroundColor: '#E4E1EB',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        color: '#00003C',
        fontSize: 16,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E4E1EB',
        borderRadius: 12,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 20,
        color: '#00003C',
        fontSize: 16,
    },
    eyeBtn: {
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    forgotText: {
        color: "#000080",
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold
    },
    button: {
        backgroundColor: '#00003C',
        borderRadius: 100,
        padding: 20,
        alignItems: 'center',
        marginTop: 48,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: '#ff4d4d',
        marginTop: 10
    },
    reqAccessRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24
    },
    reqAccessText: {
        fontFamily: Fonts.inter.medium,
        fontSize: 14,
        color: "#464653"
    },
    reqAccessBtnText: {
        fontFamily: Fonts.inter.semiBold,
        fontSize: 14,
        color: "#00003C",
        marginBottom: 64
    },
    trustRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        gap: 24,
        opacity: 0.3
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    trustText: {
        fontFamily: Fonts.inter.semiBold,
        fontSize: 10,
        color: '#1B1B22',
    },
    footerText: {
        fontFamily: Fonts.inter.medium,
        color: "rgba(70,70,83,0.3)",
        textTransform: "uppercase",
        marginTop: 60
    },
    footerBtnRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
    },
    footerBtnText: {
        fontFamily: Fonts.inter.semiBold,
        color: "rgba(70,70,83,0.3)",
        textTransform: "uppercase",


    },
});