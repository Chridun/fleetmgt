import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";

import DashboardScreen from "@/screens/DashboardScreen";
import FleetScreen from "@/screens/FleetScreen";
import TeamScreen from "@/screens/TeamScreen";
import TruckersScreen from "@/screens/TruckersScreen";
import RemindersScreen from "@/screens/RemindersScreen";
import MyLicensesScreen from "@/screens/MyLicensesScreen";
import FuelLogScreen from "@/screens/FuelLogScreen";
import FuelAnalyticsScreen from "@/screens/FuelAnalyticsScreen";
import TruckAssignmentsScreen from "@/screens/TruckAssignmentsScreen";
import AccountScreen from "@/screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  const isStaff = user?.role === "driver" || user?.role === "helper";
  const isSuperAdmin = user?.role === "super_admin";
  const isTruckerAdmin = user?.role === "trucker_admin" || user?.role === "trucker_finance";

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.icon,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerTransparent: true,
        headerBlurEffect: "regular",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          title: t("navigation.home"),
          headerTitle: t("app.name"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      {isSuperAdmin ? (
        <>
          <Tab.Screen
            name="TruckersTab"
            component={TruckersScreen}
            options={{
              title: t("navigation.truckers"),
              headerTitle: t("truckers.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="briefcase" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="FleetTab"
            component={FleetScreen}
            options={{
              title: t("navigation.fleet"),
              headerTitle: t("fleet.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="truck" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="TeamTab"
            component={TeamScreen}
            options={{
              title: t("navigation.team"),
              headerTitle: t("team.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="users" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="RemindersTab"
            component={RemindersScreen}
            options={{
              title: t("navigation.reminders"),
              headerTitle: t("reminders.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="bell" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : null}
      {isTruckerAdmin ? (
        <>
          <Tab.Screen
            name="FleetTab"
            component={FleetScreen}
            options={{
              title: t("navigation.fleet"),
              headerTitle: t("fleet.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="truck" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AssignmentsTab"
            component={TruckAssignmentsScreen}
            options={{
              title: t("navigation.assignments"),
              headerTitle: t("assignments.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="clipboard" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="TeamTab"
            component={TeamScreen}
            options={{
              title: t("navigation.team"),
              headerTitle: t("team.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="users" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="FuelAnalyticsTab"
            component={FuelAnalyticsScreen}
            options={{
              title: t("navigation.fuel"),
              headerTitle: t("fuelLog.analytics"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="droplet" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="RemindersTab"
            component={RemindersScreen}
            options={{
              title: t("navigation.reminders"),
              headerTitle: t("reminders.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="bell" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : null}
      {isStaff ? (
        <>
          <Tab.Screen
            name="FuelTab"
            component={FuelLogScreen}
            options={{
              title: t("navigation.fuel"),
              headerTitle: t("fuelLog.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="droplet" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="LicensesTab"
            component={MyLicensesScreen}
            options={{
              title: t("navigation.licenses"),
              headerTitle: t("licenses.title"),
              tabBarIcon: ({ color, size }) => (
                <Feather name="file-text" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : null}
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{
          title: t("navigation.account"),
          headerTitle: t("account.title"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
