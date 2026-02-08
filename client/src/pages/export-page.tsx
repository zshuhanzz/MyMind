import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Table, FileDown, ClipboardList } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import apiClient from '../config/api-client';

export default function ExportPage() {
  const [csvLoading, setCsvLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const handleCSV = async () => {
    setCsvLoading(true);
    try {
      const response = await apiClient.post('/export/csv', {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mindbridge-mood-data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setCsvLoading(false);
    }
  };

  const handleTherapistSummary = async () => {
    setSummaryLoading(true);
    try {
      const { data } = await apiClient.get('/export/therapist-summary');
      setSummaryData(data);
    } catch {
      // silently fail
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-warmgray-900">Export your data</h2>
        <p className="text-warmgray-500 mt-1">
          Your data belongs to you. Download it anytime, or share a summary with your therapist.
        </p>
      </div>

      <Card hoverable>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
            <Table className="text-sky-400" size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-warmgray-900">CSV Export</h3>
            <p className="text-sm text-warmgray-500 mt-1">
              Raw mood data in spreadsheet format. Perfect for your own analysis.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={handleCSV} loading={csvLoading}>
              <FileDown size={14} /> Download CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card hoverable>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center shrink-0">
            <ClipboardList className="text-lavender-500" size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-warmgray-900">Therapist Summary</h3>
            <p className="text-sm text-warmgray-500 mt-1">
              A structured overview of your mood data from the past 30 days.
              You can share this with your therapist to help them understand how you've been.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={handleTherapistSummary} loading={summaryLoading}>
              <FileText size={14} /> Generate summary
            </Button>
          </div>
        </div>
      </Card>

      {summaryData && (
        <Card>
          <h3 className="font-heading font-bold text-warmgray-900 mb-4">Your Summary</h3>
          <div className="space-y-3 text-sm text-warmgray-600">
            <p><strong>Period:</strong> {summaryData.period}</p>
            <p><strong>Total check-ins:</strong> {summaryData.overview?.totalCheckIns || 0}</p>
            <p><strong>Average mood:</strong> {summaryData.overview?.averageMood || 'N/A'}/10</p>
            <p><strong>Current streak:</strong> {summaryData.overview?.currentStreak || 0} days</p>
            {summaryData.overview?.topEmotions?.length > 0 && (
              <div>
                <strong>Top emotions:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {summaryData.overview.topEmotions.map((e: any) => (
                    <span key={e.emotion} className="px-2 py-0.5 bg-lavender-50 text-lavender-600 text-xs rounded-full">
                      {e.emotion} ({e.count})
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-warmgray-400 mt-4 italic">{summaryData.disclaimer}</p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
