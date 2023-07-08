import { GetServerSideProps } from "next";
import { Chat } from "../components/Chat";
import { getReport } from "../lib/activeReports";
import { formatTime } from "../lib/utils";
import styles from "../styles/responders.module.css";
import { ActiveReport } from "../types";

export default function Responders({
  activeReport,
}: {
  activeReport: ActiveReport;
}) {
  // const router = useRouter();
  // const reportId = router.query.id as string;
  // const query = useQuery(["report", reportId], () =>
  //   apiClient.fetchReport(reportId)
  // );
  return (
    <div className={styles.root}>
      <h1>Transit Watch Live Chat</h1>
      <p>
        You are chatting with an ETS rider that does not have cell reception.
      </p>
      <div className={styles.content}>
        <Chat report={activeReport} userType="responder" />
        <ReportDisplay activeReport={activeReport} />
      </div>
    </div>
  );
}

const ReportDisplay = ({ activeReport }: { activeReport: ActiveReport }) => {
  const data = activeReport.data;
  const submitTime = new Date(data.timestamp);
  const locationUpdated = timeSinceHumanReadable(submitTime);
  return (
    <div className={styles.reportData}>
      <h2>Report Details</h2>
      <hr className="my-3" />
      <p>Report ID: {activeReport.id}</p>
      <p>{data.issues}</p>
      {data.details && <p>{data.details}</p>}
      {data.locationType === "station" && <p>Station: {data.station}</p>}
      {data.locationType === "train" && <p>Train: {data.route}</p>}
      {data.locationType === "train" && (
        <p>
          Next Stop: {data.nextStation} (last updated {locationUpdated}
        </p>
      )}
      {data.locationDetails && <p>Location: {data.locationDetails}</p>}

      <p>Submitted: {formatTime(submitTime)}</p>
    </div>
  );
};

/**Time since the given date in a human readable form */
const timeSinceHumanReadable = (date: Date) => {
  const now = new Date();
  const seconds = (now.getTime() - date.getTime()) / 1000;
  if (seconds < 60) return "just now";
  return `${Math.floor(seconds / 60)} minutes ago`;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.resolvedUrl);
  const id = context.query.id as string;
  const activeReport = getReport(id);
  if (!activeReport)
    return {
      notFound: true,
    };
  return {
    props: { activeReport },
  };
};
