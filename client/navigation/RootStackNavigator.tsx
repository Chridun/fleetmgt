import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/lib/auth";
import { getApiUrl } from "@/lib/query-client";

import LoginScreen from "@/screens/LoginScreen";
import SetupScreen from "@/screens/SetupScreen";
import MainTabNavigator from "./MainTabNavigator";
import AddTruckScreen from "@/screens/AddTruckScreen";
import AddStaffScreen from "@/screens/AddStaffScreen";
import AddTruckerScreen from "@/screens/AddTruckerScreen";
import TruckerDetailScreen from "@/screens/TruckerDetailScreen";
import TruckDetailScreen from "@/screens/TruckDetailScreen";
import StaffDetailScreen from "@/screens/StaffDetailScreen";
import AttendanceHistoryScreen from "@/screens/AttendanceHistoryScreen";
import MyLicensesScreen from "@/screens/MyLicensesScreen";
import LanguageScreen from "@/screens/LanguageScreen";
import ChangePasswordScreen from "@/screens/ChangePasswordScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import IOURequestsScreen from "@/screens/IOURequestsScreen";
import DayOffRequestsScreen from "@/screens/DayOffRequestsScreen";
import ApprovalsScreen from "@/screens/ApprovalsScreen";
import DuePaymentsScreen from "@/screens/DuePaymentsScreen";
import PayHistoryScreen from "@/screens/PayHistoryScreen";
import CheckedInStaffScreen from "@/screens/CheckedInStaffScreen";
import TruckFuelLogScreen from "@/screens/TruckFuelLogScreen";
import TruckNotesScreen from "@/screens/TruckNotesScreen";
import { useLanguage } from "@/lib/LanguageContext";

const Stack = createNativeStackNavigator();

export default function RootStackNavigator() {
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch(new URL("/api/setup/status", getApiUrl()).toString(), {
        credentials: "include",
      });
      const data = await response.json();
      setNeedsSetup(data.needsSetup);
    } catch (error) {
      setNeedsSetup(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  if (isLoading || checkingSetup) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (needsSetup && !user) {
    return <SetupScreen onComplete={() => setNeedsSetup(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerBackTitle: "",
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTruck"
            component={AddTruckScreen}
            options={{ title: "Add Truck" }}
          />
          <Stack.Screen
            name="AddStaff"
            component={AddStaffScreen}
            options={{ title: "Add Staff" }}
          />
          <Stack.Screen
            name="TruckDetail"
            component={TruckDetailScreen}
            options={{ title: "Truck Details" }}
          />
          <Stack.Screen
            name="StaffDetail"
            component={StaffDetailScreen}
            options={{ title: "Staff Details" }}
          />
          <Stack.Screen
            name="AttendanceHistory"
            component={AttendanceHistoryScreen}
            options={{ title: "Attendance History" }}
          />
          <Stack.Screen
            name="MyLicenses"
            component={MyLicensesScreen}
            options={{ title: t("licenses.title") }}
          />
          <Stack.Screen
            name="Language"
            component={LanguageScreen}
            options={{ title: t("language.title") }}
          />
          <Stack.Screen
            name="AddTrucker"
            component={AddTruckerScreen}
            options={{ title: t("truckers.addTrucker") }}
          />
          <Stack.Screen
            name="TruckerDetail"
            component={TruckerDetailScreen}
            options={{ title: t("truckerDetail.title") }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ title: t("changePassword.title") }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: t("editProfile.title") }}
          />
          <Stack.Screen
            name="IOURequests"
            component={IOURequestsScreen}
            options={{ title: t("iouRequests.title") }}
          />
          <Stack.Screen
            name="DayOffRequests"
            component={DayOffRequestsScreen}
            options={{ title: t("dayOffRequests.title") }}
          />
          <Stack.Screen
            name="Approvals"
            component={ApprovalsScreen}
            options={{ title: t("approvals.title") }}
          />
          <Stack.Screen
            name="DuePayments"
            component={DuePaymentsScreen}
            options={{ title: t("duePayments.title") }}
          />
          <Stack.Screen
            name="PayHistory"
            component={PayHistoryScreen}
            options={{ title: t("account.payHistory") }}
          />
          <Stack.Screen
            name="CheckedInStaff"
            component={CheckedInStaffScreen}
            options={{ title: t("checkedInStaff.title") }}
          />
          <Stack.Screen
            name="TruckFuelLog"
            component={TruckFuelLogScreen}
            options={{ title: t("fuelLog.title") }}
          />
          <Stack.Screen
            name="TruckNotes"
            component={TruckNotesScreen}
            options={{ title: "Notes" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
