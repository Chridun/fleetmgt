import React, { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { trucksApi } from "@/lib/api";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AddTruckScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [licensePlate, setLicensePlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [weight, setWeight] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [province, setProvince] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [registrationExpiry, setRegistrationExpiry] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [insuranceEffectiveDate, setInsuranceEffectiveDate] = useState("");
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState("");

  const handleSave = async () => {
    if (!licensePlate.trim() || !make.trim() || !model.trim()) {
      Alert.alert("Error", "Please fill in required fields (License Plate, Make, Model)");
      return;
    }

    setIsLoading(true);
    try {
      await trucksApi.create({
        licensePlate,
        make,
        model,
        year: year ? parseInt(year) : null,
        height: height || null,
        width: width || null,
        weight: weight || null,
        loadCapacity: loadCapacity || null,
        province,
        registrationDate,
        registrationExpiry,
        insurerName,
        policyNumber,
        insuranceEffectiveDate,
        insuranceExpiryDate,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add truck");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = [styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing["2xl"] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Vehicle Information</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              License Plate <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="ABC-1234"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Make <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={make}
              onChangeText={setMake}
              placeholder="e.g., Freightliner"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Model <ThemedText style={{ color: theme.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={model}
              onChangeText={setModel}
              placeholder="e.g., Cascadia"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Year</ThemedText>
            <TextInput
              style={inputStyle}
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2022"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Height (ft)</ThemedText>
                <TextInput
                  style={inputStyle}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="13.5"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Width (ft)</ThemedText>
                <TextInput
                  style={inputStyle}
                  value={width}
                  onChangeText={setWidth}
                  placeholder="8.5"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Weight (lbs)</ThemedText>
                <TextInput
                  style={inputStyle}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="80000"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Load Capacity (lbs)</ThemedText>
                <TextInput
                  style={inputStyle}
                  value={loadCapacity}
                  onChangeText={setLoadCapacity}
                  placeholder="45000"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Registration</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Province</ThemedText>
            <TextInput
              style={inputStyle}
              value={province}
              onChangeText={setProvince}
              placeholder="e.g., BC"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Registration Date</ThemedText>
            <TextInput
              style={inputStyle}
              value={registrationDate}
              onChangeText={setRegistrationDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Registration Expiry</ThemedText>
            <TextInput
              style={inputStyle}
              value={registrationExpiry}
              onChangeText={setRegistrationExpiry}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Insurance</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Insurer Name</ThemedText>
            <TextInput
              style={inputStyle}
              value={insurerName}
              onChangeText={setInsurerName}
              placeholder="e.g., Progressive"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Policy Number</ThemedText>
            <TextInput
              style={inputStyle}
              value={policyNumber}
              onChangeText={setPolicyNumber}
              placeholder="POL-123456"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Effective Date</ThemedText>
            <TextInput
              style={inputStyle}
              value={insuranceEffectiveDate}
              onChangeText={setInsuranceEffectiveDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Expiry Date</ThemedText>
            <TextInput
              style={inputStyle}
              value={insuranceExpiryDate}
              onChangeText={setInsuranceExpiryDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.tint, opacity: pressed || isLoading ? 0.7 : 1 },
          ]}
          testID="button-save-truck"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={20} color="#FFFFFF" />
              <ThemedText style={styles.saveButtonText}>Save Truck</ThemedText>
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
    gap: Spacing.md,
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
