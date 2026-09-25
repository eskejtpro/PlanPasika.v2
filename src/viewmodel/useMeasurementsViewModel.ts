import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BodyMeasurementEntry,
  BodyWeightEntry,
  BodyPartKey,
  BODY_PARTS_CONFIG,
  MetricProgressStat,
} from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';

export type MeasurementTabSection = 'measurements' | 'weight' | 'analysis';

export function useMeasurementsViewModel() {
  const [activeSection, setActiveSection] = useState<MeasurementTabSection>('measurements');
  const [measurements, setMeasurements] = useState<BodyMeasurementEntry[]>(() =>
    LocalStorageRepo.getBodyMeasurements()
  );
  const [weights, setWeights] = useState<BodyWeightEntry[]>(() =>
    LocalStorageRepo.getBodyWeightEntries()
  );

  // Selected metric for chart & detailed progress view
  const [selectedMetric, setSelectedMetric] = useState<BodyPartKey | 'weight'>('biceps');

  // Modals / forms state
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState<boolean>(false);
  const [editingMeasurement, setEditingMeasurement] = useState<BodyMeasurementEntry | null>(null);

  const [isAddWeightOpen, setIsAddWeightOpen] = useState<boolean>(false);
  const [editingWeight, setEditingWeight] = useState<BodyWeightEntry | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const refreshData = useCallback(() => {
    setMeasurements(LocalStorageRepo.getBodyMeasurements());
    setWeights(LocalStorageRepo.getBodyWeightEntries());
  }, []);

  useEffect(() => {
    refreshData();
    const unsub = LocalStorageRepo.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, [refreshData]);

  // Helper: compute stats for a specific number series
  const computeStats = useCallback(
    (
      key: string,
      label: string,
      unit: string,
      dataPoints: Array<{ date: string; value: number }>
    ): MetricProgressStat | null => {
      if (dataPoints.length === 0) return null;

      const sorted = [...dataPoints].sort((a, b) => a.date.localeCompare(b.date));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : first;

      const changeTotal = Number((last.value - first.value).toFixed(2));
      const changePrevious = Number((last.value - prev.value).toFixed(2));
      const percentChange = first.value > 0 ? Number(((changeTotal / first.value) * 100).toFixed(1)) : 0;

      // Calculate time delta in days
      const dFirst = new Date(first.date).getTime();
      const dLast = new Date(last.date).getTime();
      const days = Math.max(1, Math.round((dLast - dFirst) / (1000 * 60 * 60 * 24)));

      let weeklyChange = 0;
      let monthlyChange = 0;
      if (days >= 2 && sorted.length >= 2) {
        weeklyChange = Number(((changeTotal / days) * 7).toFixed(2));
        monthlyChange = Number(((changeTotal / days) * 30.4375).toFixed(2));
      }

      const sign = monthlyChange > 0 ? '+' : '';
      const monthlyRateString = `${sign}${monthlyChange.toFixed(1)} ${unit}/miesiąc`;

      let trend: 'rośnie' | 'spada' | 'stabilnie' = 'stabilnie';
      if (changeTotal >= 0.15) trend = 'rośnie';
      else if (changeTotal <= -0.15) trend = 'spada';

      const values = sorted.map((p) => p.value);
      const min = Math.min(...values);
      const max = Math.max(...values);

      return {
        key,
        label,
        unit,
        current: last.value,
        start: first.value,
        changeTotal,
        changePrevious,
        percentChange,
        count: sorted.length,
        weeklyChange,
        monthlyChange,
        monthlyRateString,
        trend,
        min,
        max,
      };
    },
    []
  );

  // Stats for each body part
  const bodyPartStats = useMemo(() => {
    const map: Record<BodyPartKey, MetricProgressStat | null> = {
      biceps: null,
      triceps: null,
      chest: null,
      shoulders: null,
      waist: null,
      hips: null,
      thigh: null,
      calf: null,
    };

    BODY_PARTS_CONFIG.forEach((part) => {
      const points: Array<{ date: string; value: number }> = [];
      measurements.forEach((m) => {
        const val = m[part.key];
        if (typeof val === 'number' && !isNaN(val)) {
          points.push({ date: m.date, value: val });
        }
      });
      map[part.key] = computeStats(part.key, part.label, part.unit, points);
    });

    return map;
  }, [measurements, computeStats]);

  // Stats for body weight
  const weightStats = useMemo(() => {
    const points = weights.map((w) => ({ date: w.date, value: w.weight }));
    return computeStats('weight', 'Masa ciała', 'kg', points);
  }, [weights, computeStats]);

  // Chart data for current selected metric
  const chartData = useMemo(() => {
    if (selectedMetric === 'weight') {
      return weights.map((w) => ({
        id: w.id,
        date: w.date,
        value: w.weight,
        unit: 'kg',
        notes: w.notes,
      }));
    }

    const partConfig = BODY_PARTS_CONFIG.find((p) => p.key === selectedMetric);
    const unit = partConfig?.unit || 'cm';

    return measurements
      .filter((m) => typeof m[selectedMetric] === 'number')
      .map((m) => ({
        id: m.id,
        date: m.date,
        value: m[selectedMetric] as number,
        unit,
        notes: m.notes,
      }));
  }, [selectedMetric, weights, measurements]);

  // History list for the selected body part or weight
  const activeMetricStat = useMemo(() => {
    if (selectedMetric === 'weight') return weightStats;
    return bodyPartStats[selectedMetric];
  }, [selectedMetric, weightStats, bodyPartStats]);

  // CRUD for Body Measurements
  const handleSaveMeasurement = (data: {
    id?: string;
    date: string;
    biceps?: number;
    triceps?: number;
    chest?: number;
    shoulders?: number;
    waist?: number;
    hips?: number;
    thigh?: number;
    calf?: number;
    notes?: string;
  }) => {
    if (data.id) {
      LocalStorageRepo.updateBodyMeasurement(data.id, data);
      showToast(`Zaktualizowano pomiary z dnia ${data.date}`);
      setEditingMeasurement(null);
    } else {
      LocalStorageRepo.addBodyMeasurement(data);
      showToast(`Zapisano nowe pomiary ciała (${data.date})`);
      setIsAddMeasurementOpen(false);
    }
  };

  const handleDeleteMeasurement = (id: string, date: string) => {
    LocalStorageRepo.deleteBodyMeasurement(id);
    showToast(`Usunięto pomiar z dnia ${date}`);
  };

  // CRUD for Body Weight
  const handleSaveWeight = (data: { id?: string; date: string; weight: number; notes?: string }) => {
    if (data.id) {
      LocalStorageRepo.updateBodyWeightEntry(data.id, data);
      showToast(`Zaktualizowano wagę: ${data.weight} kg (${data.date})`);
      setEditingWeight(null);
    } else {
      LocalStorageRepo.addBodyWeightEntry(data);
      showToast(`Zapisano pomiar wagi: ${data.weight} kg (${data.date})`);
      setIsAddWeightOpen(false);
    }
  };

  const handleDeleteWeight = (id: string, date: string) => {
    LocalStorageRepo.deleteBodyWeightEntry(id);
    showToast(`Usunięto wpis wagi z dnia ${date}`);
  };

  return {
    activeSection,
    setActiveSection,
    measurements,
    weights,
    selectedMetric,
    setSelectedMetric,
    bodyPartStats,
    weightStats,
    activeMetricStat,
    chartData,
    toastMessage,
    isAddMeasurementOpen,
    setIsAddMeasurementOpen,
    editingMeasurement,
    setEditingMeasurement,
    isAddWeightOpen,
    setIsAddWeightOpen,
    editingWeight,
    setEditingWeight,
    handleSaveMeasurement,
    handleDeleteMeasurement,
    handleSaveWeight,
    handleDeleteWeight,
  };
}
