import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/LanguageContext";
import { organizationsApi, usersApi } from "@/lib/api";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AddTruckerScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const showError = (message: string) => {
    setError(message);
    if (Platform.OS !== "web") {
      Alert.alert(t("common.error"), message);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!orgName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      showError(t("errors.requiredFields"));
      return;
    }

    if (adminPassword.length < 6) {
      showError(t("errors.passwordTooShort"));
      return;
    }

    setIsLoading(true);
    try {
      const org = await organizationsApi.create({
        name: orgName.trim(),
        remindersEnabled: true,
      });

      const newUser = await usersApi.create({
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
        fullName: adminName.trim(),
        phone: adminPhone.trim() || undefined,
        role: "trucker_admin",
        organizationId: org.id,
        isActive: true,
      });

      await organizationsApi.update(org.id, { ownerId: newUser.id });

      if (Platform.OS === "web") {
        window.alert(t("truckers.truckerCreated"));
        navigation.goBack();
      } else {
        Alert.alert(
          t("common.success"),
          t("truckers.truckerCreated"),
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      showError(error.message || t("errors.createFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing["2xl"] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.error + "15", borderColor: theme.error }]}>
            <Feather name="alert-circle" size={20} color={theme.error} />
            <ThemedText style={[styles.errorText, { color: theme.error }]}>{error}</ThemedText>
          </View>
        ) : null}
        
        <Card style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {t("truckers.organizationInfo")}
          </ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("truckers.companyName")} *</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="briefcase" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={orgName}
                onChangeText={setOrgName}
                placeholder={t("truckers.enterCompanyName")}
                placeholderTextColor={theme.textSecondary}
                testID="input-org-name"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {t("truckers.adminAccount")}
          </ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("truckers.adminName")} *</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="user" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={adminName}
                onChangeText={setAdminName}
                placeholder={t("truckers.enterAdminName")}
                placeholderTextColor={theme.textSecondary}
                testID="input-admin-name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("auth.email")} *</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="mail" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={adminEmail}
                onChangeText={setAdminEmail}
                placeholder={t("auth.enterEmail")}
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="input-admin-email"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("auth.password")} *</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="lock" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={adminPassword}
                onChangeText={setAdminPassword}
                placeholder={t("auth.enterPassword")}
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                testID="input-admin-password"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.icon} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("truckers.phone")}</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Feather name="phone" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={adminPhone}
                onChangeText={setAdminPhone}
                placeholder={t("truckers.enterPhone")}
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
                testID="input-admin-phone"
              />
            </View>
          </View>
        </Card>

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: theme.tint, opacity: pressed || isLoading ? 0.7 : 1 },
          ]}
          testID="button-create-trucker"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="plus" size={20} color="#FFFFFF" />
              <ThemedText style={styles.submitButtonText}>{t("truckers.createTrucker")}</ThemedText>
            </>
          )}
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  eyeButton: {
    padding: Spacing.sm,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
