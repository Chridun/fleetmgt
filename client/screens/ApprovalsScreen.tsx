import React, { useState, useCallback } from "react";
import { View, FlatList, Pressable, StyleSheet, Alert, Platform, RefreshControl, TextInput, Modal, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/LanguageContext";
import { iouApi, dayOffApi, profileEditApi, flaggedAttendanceApi } from "@/lib/api";
import { Spacing, BorderRadius } from "@/constants/theme";

type TabType = "iou" | "dayoff" | "profile" | "flagged";

export default function ApprovalsScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<TabType>("iou");
  const [iouRequests, setIouRequests] = useState<any[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<any[]>([]);
  const [profileEditRequests, setProfileEditRequests] = useState<any[]>([]);
  const [flaggedRecords, setFlaggedRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [resolveModal, setResolveModal] = useState<any | null>(null);
  const [resolveEndHour, setResolveEndHour] = useState("");
  const [resolveEndMinute, setResolveEndMinute] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [iouData, dayOffData, profileEditData, flaggedData] = await Promise.all([
        iouApi.getAll(),
        dayOffApi.getAll(),
        profileEditApi.getAll(),
        flaggedAttendanceApi.getAll(),
      ]);
      setIouRequests(iouData);
      setDayOffRequests(dayOffData);
      setProfileEditRequests(profileEditData);
      setFlaggedRecords(flaggedData);
    } catch (error) {
      console.error("Failed to load approval requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleIouAction = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      await iouApi.update(id, status);
      loadData();
      const message = status === "approved" ? t("approvals.approved") : t("approvals.declined");
      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert(t("common.success"), message);
      }
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert(error?.message || t("common.saveFailed"));
      } else {
        Alert.alert(t("common.error"), error?.message || t("common.saveFailed"));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleDayOffAction = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      await dayOffApi.update(id, status);
      loadData();
      const message = status === "approved" ? t("approvals.approved") : t("approvals.declined");
      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert(t("common.success"), message);
      }
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert(error?.message || t("common.saveFailed"));
      } else {
        Alert.alert(t("common.error"), error?.message || t("common.saveFailed"));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleProfileEditAction = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      await profileEditApi.update(id, status);
      loadData();
      const message = status === "approved" ? t("approvals.approved") : t("approvals.declined");
      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert(t("common.success"), message);
      }
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert(error?.message || t("common.saveFailed"));
      } else {
        Alert.alert(t("common.error"), error?.message || t("common.saveFailed"));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const openResolveModal = (record: any) => {
    setResolveModal(record);
    setResolveEndHour("");
    setResolveEndMinute("");
  };

  const handleResolveAttendance = async () => {
    if (!resolveModal) return;
    const hr = parseInt(resolveEndHour, 10);
    const min = parseInt(resolveEndMinute || "0", 10);
    if (isNaN(hr) || hr < 0 || hr > 23 || isNaN(min) || min < 0 || min > 59) {
      const msg = "Please enter a valid end time (hour 0-23, minute 0-59)";
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("Invalid Input", msg);
      }
      return;
    }

    setProcessingId(resolveModal.id);
    try {
      const checkInDate = new Date(resolveModal.checkInTime);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setHours(hr, min, 0, 0);
      if (checkOutDate <= checkInDate) {
        checkOutDate.setDate(checkOutDate.getDate() + 1);
      }

      const diffMs = checkOutDate.getTime() - checkInDate.getTime();
      const hoursWorked = (diffMs / (1000 * 60 * 60)).toFixed(2);

      await flaggedAttendanceApi.resolve(resolveModal.id, {
        checkOutTime: checkOutDate.toISOString(),
        hoursWorked,
      });
      setResolveModal(null);
      loadData();
      const msg = "Attendance resolved successfully";
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert(t("common.success"), msg);
      }
    } catch (error: any) {
      const errMsg = error?.message || "Failed to resolve attendance";
      if (Platform.OS === "web") {
        window.alert(errMsg);
      } else {
        Alert.alert(t("common.error"), errMsg);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return theme.success;
      case "rejected": return theme.error;
      default: return theme.warning;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "--:--";
    return new Date(timeStr).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  const getDaysCount = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diff = Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  const renderIouRequest = ({ item }: { item: any }) => {
    const isPending = item.status === "pending";
    const isProcessing = processingId === item.id;
    
    return (
      <Card style={{
        ...styles.requestCard,
        ...(isPending ? { borderLeftWidth: 4, borderLeftColor: theme.warning } : {}),
      }}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <ThemedText style={styles.requesterName}>
              {item.user?.fullName || t("approvals.requester")}
            </ThemedText>
            <View style={styles.amountRow}>
              <ThemedText style={styles.amountText}>
                ${parseFloat(item.amount).toFixed(2)}
              </ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {t(`common.${item.status}`)}
                </ThemedText>
              </View>
            </View>
          </View>
          <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>
            {formatDate(item.createdAt)}
          </ThemedText>
        </View>
        {item.reason ? (
          <ThemedText style={[styles.reasonText, { color: theme.textSecondary }]}>
            {item.reason}
          </ThemedText>
        ) : null}
        {isPending ? (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.approveButton, { backgroundColor: theme.success }]}
              onPress={() => handleIouAction(item.id, "approved")}
              disabled={isProcessing}
            >
              <Feather name="check" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.approve")}</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.declineButton, { backgroundColor: theme.error }]}
              onPress={() => handleIouAction(item.id, "rejected")}
              disabled={isProcessing}
            >
              <Feather name="x" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.decline")}</ThemedText>
            </Pressable>
          </View>
        ) : null}
      </Card>
    );
  };

  const renderDayOffRequest = ({ item }: { item: any }) => {
    const isPending = item.status === "pending";
    const isProcessing = processingId === item.id;
    const daysCount = getDaysCount(item.startDate, item.endDate);
    
    return (
      <Card style={{
        ...styles.requestCard,
        ...(isPending ? { borderLeftWidth: 4, borderLeftColor: theme.warning } : {}),
      }}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <ThemedText style={styles.requesterName}>
              {item.user?.fullName || t("approvals.requester")}
            </ThemedText>
            <View style={styles.dateRangeRow}>
              <Feather name="calendar" size={16} color={theme.tint} />
              <View style={styles.dateRangeInfo}>
                <ThemedText style={styles.dateRangeText}>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </ThemedText>
                <ThemedText style={[styles.daysText, { color: theme.textSecondary }]}>
                  {daysCount} {daysCount === 1 ? t("common.day") : t("common.days")}
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {t(`common.${item.status}`)}
            </ThemedText>
          </View>
        </View>
        {item.reason ? (
          <ThemedText style={[styles.reasonText, { color: theme.textSecondary }]}>
            {item.reason}
          </ThemedText>
        ) : null}
        {isPending ? (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.approveButton, { backgroundColor: theme.success }]}
              onPress={() => handleDayOffAction(item.id, "approved")}
              disabled={isProcessing}
            >
              <Feather name="check" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.approve")}</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.declineButton, { backgroundColor: theme.error }]}
              onPress={() => handleDayOffAction(item.id, "rejected")}
              disabled={isProcessing}
            >
              <Feather name="x" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.decline")}</ThemedText>
            </Pressable>
          </View>
        ) : null}
      </Card>
    );
  };

  const renderIouEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="credit-card" size={48} color={theme.textSecondary} />
      <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
        {t("approvals.noIouRequests")}
      </ThemedText>
    </View>
  );

  const renderDayOffEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="clock" size={48} color={theme.textSecondary} />
      <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
        {t("approvals.noDayOffRequests")}
      </ThemedText>
    </View>
  );

  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      firstName: t("profile.firstName"),
      lastName: t("profile.lastName"),
      phone: t("profile.phone"),
      email: t("common.email"),
      address: t("profile.address"),
    };
    return labels[fieldName] || fieldName;
  };

  const renderProfileEditRequest = ({ item }: { item: any }) => {
    const isPending = item.status === "pending";
    const isProcessing = processingId === item.id;
    
    return (
      <Card style={{
        ...styles.requestCard,
        ...(isPending ? { borderLeftWidth: 4, borderLeftColor: theme.warning } : {}),
      }}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <ThemedText style={styles.requesterName}>
              {item.userName || t("approvals.requester")}
            </ThemedText>
            <ThemedText style={[styles.fieldName, { color: theme.tint }]}>
              {getFieldLabel(item.fieldName)}
            </ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {t(`common.${item.status}`)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.changeRow}>
          <View style={styles.changeItem}>
            <ThemedText style={[styles.changeLabel, { color: theme.textSecondary }]}>{t("approvals.oldValue")}</ThemedText>
            <ThemedText style={styles.changeValue}>{item.oldValue || "-"}</ThemedText>
          </View>
          <Feather name="arrow-right" size={16} color={theme.textSecondary} />
          <View style={styles.changeItem}>
            <ThemedText style={[styles.changeLabel, { color: theme.textSecondary }]}>{t("approvals.newValue")}</ThemedText>
            <ThemedText style={[styles.changeValue, { color: theme.tint }]}>{item.newValue}</ThemedText>
          </View>
        </View>
        {isPending ? (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.approveButton, { backgroundColor: theme.success }]}
              onPress={() => handleProfileEditAction(item.id, "approved")}
              disabled={isProcessing}
            >
              <Feather name="check" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.approve")}</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.declineButton, { backgroundColor: theme.error }]}
              onPress={() => handleProfileEditAction(item.id, "rejected")}
              disabled={isProcessing}
            >
              <Feather name="x" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>{t("approvals.decline")}</ThemedText>
            </Pressable>
          </View>
        ) : null}
      </Card>
    );
  };

  const renderProfileEditEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="user" size={48} color={theme.textSecondary} />
      <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
        {t("approvals.noProfileEditRequests")}
      </ThemedText>
    </View>
  );

  const renderFlaggedRecord = ({ item }: { item: any }) => {
    const isProcessing = processingId === item.id;

    return (
      <Card style={{
        ...styles.requestCard,
        borderLeftWidth: 4,
        borderLeftColor: theme.error,
      }}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <ThemedText style={styles.requesterName}>{item.fullName}</ThemedText>
            <ThemedText style={{ color: theme.textSecondary, fontSize: 13 }}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: theme.error + "20" }]}>
            <ThemedText style={[styles.statusText, { color: theme.error }]}>
              Needs Review
            </ThemedText>
          </View>
        </View>

        <View style={[styles.flaggedDetails, { backgroundColor: theme.backgroundSecondary || theme.background }]}>
          <View style={styles.flaggedRow}>
            <Feather name="calendar" size={14} color={theme.textSecondary} />
            <ThemedText style={{ fontSize: 14, marginLeft: Spacing.sm }}>
              {formatDate(item.date)}
            </ThemedText>
          </View>
          <View style={styles.flaggedRow}>
            <Feather name="log-in" size={14} color={theme.tint} />
            <ThemedText style={{ fontSize: 14, marginLeft: Spacing.sm }}>
              Checked in at {formatTime(item.checkInTime)}
            </ThemedText>
          </View>
          <View style={styles.flaggedRow}>
            <Feather name="alert-triangle" size={14} color={theme.error} />
            <ThemedText style={{ fontSize: 13, marginLeft: Spacing.sm, color: theme.error }}>
              Never checked out
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.tint }]}
            onPress={() => openResolveModal(item)}
            disabled={isProcessing}
          >
            <Feather name="edit-3" size={16} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Set Work End</ThemedText>
          </Pressable>
        </View>
      </Card>
    );
  };

  const renderFlaggedEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="check-circle" size={48} color={theme.success} />
      <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
        No flagged attendance records
      </ThemedText>
      <ThemedText style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm, fontSize: 14 }}>
        All attendance sessions are complete
      </ThemedText>
    </View>
  );

  const renderResolveModal = () => (
    <Modal
      visible={resolveModal !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setResolveModal(null)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setResolveModal(null)}>
        <Pressable style={[styles.modalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <ThemedText type="h3">Resolve Attendance</ThemedText>
            <Pressable onPress={() => setResolveModal(null)} hitSlop={12}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} bounces={false}>
            {resolveModal ? (
              <>
                <View style={[styles.modalInfoBox, { backgroundColor: theme.backgroundSecondary }]}>
                  <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: Spacing.sm }}>
                    {resolveModal.fullName}
                  </ThemedText>
                  <View style={styles.flaggedRow}>
                    <Feather name="calendar" size={14} color={theme.textSecondary} />
                    <ThemedText style={{ fontSize: 14, marginLeft: Spacing.sm }}>
                      {formatDate(resolveModal.date)}
                    </ThemedText>
                  </View>
                  <View style={styles.flaggedRow}>
                    <Feather name="log-in" size={14} color={theme.tint} />
                    <ThemedText style={{ fontSize: 14, marginLeft: Spacing.sm }}>
                      Checked in at {formatTime(resolveModal.checkInTime)}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm, fontWeight: "600" }}>
                  Work End Time
                </ThemedText>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 13, marginBottom: Spacing.md }}>
                  Enter the time this person actually stopped working
                </ThemedText>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputGroup}>
                    <ThemedText style={[styles.timeInputLabel, { color: theme.textSecondary }]}>Hour</ThemedText>
                    <TextInput
                      style={[styles.timeInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.background }]}
                      placeholder="17"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={resolveEndHour}
                      onChangeText={setResolveEndHour}
                      testID="input-end-hour"
                    />
                  </View>
                  <ThemedText style={{ fontSize: 28, fontWeight: "700", marginTop: Spacing.lg }}>:</ThemedText>
                  <View style={styles.timeInputGroup}>
                    <ThemedText style={[styles.timeInputLabel, { color: theme.textSecondary }]}>Min</ThemedText>
                    <TextInput
                      style={[styles.timeInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.background }]}
                      placeholder="00"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={resolveEndMinute}
                      onChangeText={setResolveEndMinute}
                      testID="input-end-minute"
                    />
                  </View>
                </View>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 12, marginTop: Spacing.sm }}>
                  Use 24-hour format (e.g. 17:00 for 5:00 PM)
                </ThemedText>

                <Pressable
                  style={[styles.resolveButton, { backgroundColor: theme.tint }]}
                  onPress={handleResolveAttendance}
                  disabled={processingId === resolveModal?.id}
                >
                  <Feather name="check" size={18} color="#FFFFFF" />
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16, marginLeft: Spacing.sm }}>
                    Resolve
                  </ThemedText>
                </Pressable>
              </>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const pendingIou = iouRequests.filter(r => r.status === "pending").length;
  const pendingDayOff = dayOffRequests.filter(r => r.status === "pending").length;
  const pendingProfile = profileEditRequests.filter(r => r.status === "pending").length;
  const pendingFlagged = flaggedRecords.length;

  const renderTab = (tab: TabType, icon: string, label: string, count: number) => (
    <Pressable
      key={tab}
      style={[
        styles.tab,
        activeTab === tab ? { backgroundColor: theme.tint } : { backgroundColor: theme.backgroundSecondary },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Feather
        name={icon as any}
        size={16}
        color={activeTab === tab ? "#FFFFFF" : theme.textSecondary}
      />
      <ThemedText
        style={[
          styles.tabText,
          activeTab === tab ? { color: "#FFFFFF" } : { color: theme.textSecondary },
        ]}
        numberOfLines={1}
      >
        {label}
      </ThemedText>
      {count > 0 ? (
        <View style={[styles.tabBadge, { backgroundColor: activeTab === tab ? "rgba(255,255,255,0.3)" : theme.error }]}>
          <ThemedText style={styles.tabBadgeText}>{count}</ThemedText>
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      {renderResolveModal()}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabScrollContainer, { marginTop: headerHeight + Spacing.md }]}
        contentContainerStyle={styles.tabContainer}
      >
        {renderTab("flagged", "alert-triangle", "Flagged", pendingFlagged)}
        {renderTab("iou", "credit-card", t("approvals.iouRequests"), pendingIou)}
        {renderTab("dayoff", "clock", t("approvals.dayOffRequests"), pendingDayOff)}
        {renderTab("profile", "user", t("approvals.profileEdits"), pendingProfile)}
      </ScrollView>

      {activeTab === "flagged" ? (
        <FlatList
          data={flaggedRecords}
          keyExtractor={(item) => item.id}
          renderItem={renderFlaggedRecord}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
          ListEmptyComponent={!isLoading ? renderFlaggedEmptyState : null}
        />
      ) : activeTab === "iou" ? (
        <FlatList
          data={iouRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderIouRequest}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
          ListEmptyComponent={!isLoading ? renderIouEmptyState : null}
        />
      ) : activeTab === "dayoff" ? (
        <FlatList
          data={dayOffRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderDayOffRequest}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
          ListEmptyComponent={!isLoading ? renderDayOffEmptyState : null}
        />
      ) : (
        <FlatList
          data={profileEditRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderProfileEditRequest}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
          ListEmptyComponent={!isLoading ? renderProfileEditEmptyState : null}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabScrollContainer: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  requestCard: {
    marginBottom: Spacing.md,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  requestInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
  },
  dateRangeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  dateRangeInfo: {
    flex: 1,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  daysText: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 13,
  },
  reasonText: {
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  approveButton: {},
  declineButton: {},
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing["3xl"],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  fieldName: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  changeItem: {
    flex: 1,
  },
  changeLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  flaggedDetails: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  flaggedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  modalInfoBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  timeInputGroup: {
    alignItems: "center",
  },
  timeInputLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    width: 80,
  },
  resolveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
