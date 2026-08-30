import React, { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { usersApi } from "@/lib/api";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AddStaffScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [role, setRole] = useState<"driver" | "helper" | "trucker_admin" | "trucker_finance">("driver");
  const [wageAmount, setWageAmount] = useState("");
  const [payFrequency, setPayFrequency] = useState<"hourly" | "daily">("daily");
  const [employmentStatus, setEmploymentStatus] = useState<"permanent" | "temporary">("permanent");
  const [tempExpiryDate, setTempExpiryDate] = useState("");
  const [error, setError] = useState("");

  const showError = (message: string) => {
    setError(message);
    if (Platform.OS !== "web") {
      Alert.alert("Error", message);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showError("Please fill in required fields (Name, Email, Password)");
      return;
    }

    setIsLoading(true);
    try {
      await usersApi.create({
        fullName,
        email,
        password,
        phone,
        address,
        nationality,
        dateOfBirth: dateOfBirth || null,
        sex,
        role,
        wageAmount: wageAmount || null,
        payFrequency,
        employmentStatus,
        tempExpiryDate: tempExpiryDate || null,
      });
      navigation.goBack();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to add staff");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = [styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }];

  const roleOptions: Array<{ label: string; value: typeof role }> = [
    { label: "Driver", value: "driver" },
    { label: "Helper", value: "helper" },
    { label: "Admin", value: "trucker_admin" },
    { label: "Finance", value: "trucker_finance" },
  ];

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
        
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Role</ThemedText>
          <View style={styles.roleRow}>
            {roleOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setRole(option.value)}
                style={[
                  styles.roleButton,
                  { 
                    backgroundColor: role === option.value ? theme.tint : theme.surface,
                    borderColor: role === option.value ? theme.tint : theme.border,
                  },
                ]}
              >
                <ThemedText style={{ color: role === option.value ? "#FFFFFF" : theme.text }}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Full Name <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Email <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Password <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone</ThemedText>
            <TextInput
              style={inputStyle}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 234 567 8900"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Date of Birth</ThemedText>
            <TextInput
              style={inputStyle}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Sex</ThemedText>
            <View style={styles.row}>
              {["Male", "Female", "Other"].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setSex(option)}
                  style={[
                    styles.roleButton,
                    { 
                      flex: 1,
                      backgroundColor: sex === option ? theme.tint : theme.surface,
                      borderColor: sex === option ? theme.tint : theme.border,
                    },
                  ]}
                >
                  <ThemedText style={{ color: sex === option ? "#FFFFFF" : theme.text }}>
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Address</ThemedText>
            <TextInput
              style={inputStyle}
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main St, City"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nationality</ThemedText>
            <TextInput
              style={inputStyle}
              value={nationality}
              onChangeText={setNationality}
              placeholder="Canadian"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Employment</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Employment Status</ThemedText>
            <View style={styles.row}>
              <Pressable
                onPress={() => setEmploymentStatus("permanent")}
                style={[
                  styles.roleButton,
                  { 
                    flex: 1,
                    backgroundColor: employmentStatus === "permanent" ? theme.tint : theme.surface,
                    borderColor: employmentStatus === "permanent" ? theme.tint : theme.border,
                  },
                ]}
              >
                <ThemedText style={{ color: employmentStatus === "permanent" ? "#FFFFFF" : theme.text }}>
                  Permanent
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setEmploymentStatus("temporary")}
                style={[
                  styles.roleButton,
                  { 
                    flex: 1,
                    backgroundColor: employmentStatus === "temporary" ? theme.tint : theme.surface,
                    borderColor: employmentStatus === "temporary" ? theme.tint : theme.border,
                  },
                ]}
              >
                <ThemedText style={{ color: employmentStatus === "temporary" ? "#FFFFFF" : theme.text }}>
                  Temporary
                </ThemedText>
              </Pressable>
            </View>
          </View>
          
          {employmentStatus === "temporary" ? (
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Contract End Date</ThemedText>
              <TextInput
                style={inputStyle}
                value={tempExpiryDate}
                onChangeText={setTempExpiryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Compensation</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Wage Amount ($)</ThemedText>
            <TextInput
              style={inputStyle}
              value={wageAmount}
              onChangeText={setWageAmount}
              placeholder="25.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Pay Frequency</ThemedText>
            <View style={styles.row}>
              <Pressable
                onPress={() => setPayFrequency("hourly")}
                style={[
                  styles.roleButton,
                  { 
                    flex: 1,
                    backgroundColor: payFrequency === "hourly" ? theme.tint : theme.surface,
                    borderColor: payFrequency === "hourly" ? theme.tint : theme.border,
                  },
                ]}
              >
                <ThemedText style={{ color: payFrequency === "hourly" ? "#FFFFFF" : theme.text }}>
                  Hourly
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setPayFrequency("daily")}
                style={[
                  styles.roleButton,
                  { 
                    flex: 1,
                    backgroundColor: payFrequency === "daily" ? theme.tint : theme.surface,
                    borderColor: payFrequency === "daily" ? theme.tint : theme.border,
                  },
                ]}
              >
                <ThemedText style={{ color: payFrequency === "daily" ? "#FFFFFF" : theme.text }}>
                  Daily
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.tint, opacity: pressed || isLoading ? 0.7 : 1 },
          ]}
          testID="button-save-staff"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={20} color="#FFFFFF" />
              <ThemedText style={styles.saveButtonText}>Add Staff Member</ThemedText>
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
    padding: Spacing.lg,
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
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  roleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
