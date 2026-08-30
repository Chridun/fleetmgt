import React from "react";
import { View, ScrollView, Pressable, StyleSheet, Alert, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/LanguageContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AccountScreen({ navigation }: any) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm(t("auth.logoutConfirm"))) {
        logout();
      }
    } else {
      Alert.alert(
        t("auth.logout"),
        t("auth.logoutConfirm"),
        [
          { text: t("common.cancel"), style: "cancel" },
          { text: t("auth.logout"), style: "destructive", onPress: logout },
        ]
      );
    }
  };

  const showComingSoon = () => {
    if (Platform.OS === "web") {
      window.alert("Coming soon!");
    } else {
      Alert.alert("Coming Soon", "This feature is not yet available.");
    }
  };

  const getRoleDisplay = () => {
    switch (user?.role) {
      case "super_admin": return t("roles.superAdmin");
      case "trucker_admin": return t("roles.truckerAdmin");
      case "trucker_finance": return t("roles.truckerFinance");
      case "driver": return t("roles.driver");
      case "helper": return t("roles.helper");
      default: return "User";
    }
  };

  const MenuItem = ({ icon, label, value, onPress, danger }: { icon: string; label: string; value?: string; onPress: () => void; danger?: boolean }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: theme.surface, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Feather name={icon as any} size={20} color={danger ? theme.error : theme.icon} />
      <ThemedText style={[styles.menuLabel, { color: danger ? theme.error : theme.text }]}>
        {label}
      </ThemedText>
      {value ? (
        <ThemedText style={[styles.menuValue, { color: theme.textSecondary }]}>
          {value}
        </ThemedText>
      ) : null}
      <Feather name="chevron-right" size={20} color={theme.icon} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
      >
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: theme.tint + "20" }]}>
            <ThemedText style={{ color: theme.tint, fontWeight: "bold", fontSize: 32 }}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </ThemedText>
          </View>
          <ThemedText type="h2" style={{ marginTop: Spacing.md }}>{user?.fullName}</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>{user?.email}</ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: theme.tint + "20", marginTop: Spacing.md }]}>
            <ThemedText style={{ color: theme.tint, fontWeight: "600" }}>{getRoleDisplay()}</ThemedText>
          </View>
        </Card>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>{t("account.profile")}</ThemedText>
          <View style={styles.menuGroup}>
            <MenuItem icon="user" label={t("account.editProfile")} onPress={() => navigation.navigate("EditProfile")} />
            <MenuItem icon="lock" label={t("account.changePassword")} onPress={() => navigation.navigate("ChangePassword")} />
          </View>
        </View>

        {(user?.role === "driver" || user?.role === "helper") ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>{t("account.work")}</ThemedText>
            <View style={styles.menuGroup}>
              <MenuItem icon="calendar" label={t("account.attendanceHistory")} onPress={() => navigation.navigate("AttendanceHistory")} />
              <MenuItem icon="file-text" label={t("account.myLicenses")} onPress={() => navigation.navigate("MyLicenses")} />
              <MenuItem icon="dollar-sign" label={t("account.payHistory")} onPress={() => navigation.navigate("PayHistory")} />
              <MenuItem icon="credit-card" label={t("account.iouRequests")} onPress={() => navigation.navigate("IOURequests")} />
              <MenuItem icon="clock" label={t("account.dayOffRequests")} onPress={() => navigation.navigate("DayOffRequests")} />
            </View>
          </View>
        ) : null}

        {(user?.role === "trucker_admin" || user?.role === "trucker_finance") ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>{t("account.management")}</ThemedText>
            <View style={styles.menuGroup}>
              <MenuItem icon="check-square" label={t("account.approvals")} onPress={() => navigation.navigate("Approvals")} />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>{t("account.settings")}</ThemedText>
          <View style={styles.menuGroup}>
            <MenuItem icon="bell" label={t("account.notifications")} onPress={showComingSoon} />
            <MenuItem 
              icon="globe" 
              label={t("account.language")} 
              value={currentLanguage?.nativeName}
              onPress={() => navigation.navigate("Language")} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>{t("account.about")}</ThemedText>
          <View style={styles.menuGroup}>
            <MenuItem icon="info" label={t("account.aboutApp")} onPress={() => {}} />
            <MenuItem icon="shield" label={t("account.privacyPolicy")} onPress={() => {}} />
            <MenuItem icon="file" label={t("account.termsOfService")} onPress={() => {}} />
          </View>
        </View>

        <View style={[styles.section, { marginTop: Spacing["2xl"] }]}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              { backgroundColor: theme.error + "10", opacity: pressed ? 0.7 : 1 },
            ]}
            testID="button-logout"
          >
            <Feather name="log-out" size={20} color={theme.error} />
            <ThemedText style={{ color: theme.error, fontWeight: "600", marginLeft: Spacing.sm }}>
              {t("auth.logout")}
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText style={[styles.version, { color: theme.textSecondary }]}>
          {t("account.version")} 1.0.0
        </ThemedText>
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
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuGroup: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuValue: {
    marginRight: Spacing.sm,
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  version: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
    fontSize: 12,
  },
});
