import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import xor from "lodash/xor";
import { Dispatch, SetStateAction, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { Button } from "../components/Button";
import { Chat } from "../components/Chat";
import {
  CAPITAL_LINE_STATIONS,
  METRO_LINE_STATIONS,
  TRANSIT_STATIONS,
} from "../data";
import apiClient from "../lib/apiClient";
import { formatReport } from "../lib/utils";
import styles from "../styles/index.module.css";
import { ReportingData } from "../types";

const stages = ["issue", "location", "submit", "chat"];

type Stages = (typeof stages)[number];

export default function Home() {
  const [data, setData] = useState<ReportingData>({
    locationType: "station",
    station: "Corona",
    issues: [],
    route: "Capital - Clareview",
  });
  const [customIssue, setCustomIssue] = useState<string>("");
  const [stage, setStage] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: apiClient.submitReport,
  });

  const locationTypeSetter = (type: "station" | "train") => () =>
    setData((old) => ({ ...old, locationType: type }));

  let canProceed = true;
  if (stage === 0 && data.issues.length === 0 && customIssue.length < 3)
    canProceed = false;
  if (stage === 1 && data.locationDetails === undefined) canProceed = false;

  const fullReport = {
    ...data,
    issues: [...data.issues, customIssue],
  };
  const submit = () => mutation.mutate(fullReport);

  const nextStage = () => {
    if (stage === 2) submit();
    setStage(stage + 1);
  };
  return (
    <main className="w-full flex flex-col items-center text-center text-white">
      <h1 className={styles.header}>ETS Transit Watch</h1>
      <div className={styles.content}>
        <div className="flex flex-col items-center mx-2">
          {stage === 0 && (
            <>
              <h2>What are you reporting?</h2>
              <IssueSelector
                selectedIssues={data.issues}
                toggleSelect={(issue) =>
                  setData((data) => ({
                    ...data,
                    issues: xor(data.issues, [issue]),
                  }))
                }
                customIssue={customIssue}
                setCustomIssue={setCustomIssue}
              />
              <p className="mt-8">You may select multiple options.</p>
              <p>
                Reports are forwarded immediately to the Transit Watch hotline.
              </p>
            </>
          )}
          {stages[stage] === "location" && (
            <>
              <h2>Location</h2>
              <LocationInput data={data} setData={setData} />
            </>
          )}
          {stages[stage] === "submit" && (
            <>
              <h2>Submit</h2>
              <Review data={fullReport} setData={setData} />
            </>
          )}
          {stage === 3 && <Chat report={fullReport} />}

          {stage !== 3 && (
            <div className="flex absolute bottom-3">
              {stage !== 0 && (
                <Button
                  onClick={() => setStage(stage - 1)}
                  text="Back"
                  variant="outline"
                  color="primary"
                />
              )}
              <Button
                onClick={nextStage}
                text={stage === 2 ? "Submit" : "Continue"}
                color="primary"
                disabled={!canProceed}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const issueChoices = [
  "Violence",
  "Harassment",
  "Threatening Behaviour",
  "Obstruction",
  "Drug Use",
];

interface IssueSelectorProps {
  selectedIssues: string[];
  toggleSelect: (issue: string) => void;
  customIssue?: string;
  setCustomIssue?: Dispatch<SetStateAction<string>>;
}
const IssueSelector = ({
  selectedIssues,
  toggleSelect,
  customIssue,
  setCustomIssue,
}: IssueSelectorProps) => {
  return (
    <div className={styles.issueSelector}>
      <div className={styles.issueList}>
        {issueChoices.map((issue) => (
          <button
            onClick={() => toggleSelect(issue)}
            className={clsx(
              styles.issue,
              selectedIssues.includes(issue) && styles.selected
            )}
            key={issue}
          >
            <span className="mr-2">{issue}</span>{" "}
            {selectedIssues.includes(issue) ? <FaCheck /> : <FaPlus />}
          </button>
        ))}
      </div>
      <div className="mt-2">
        Other:{" "}
        <input
          type="text"
          value={customIssue}
          onChange={(e) => setCustomIssue(e.target.value)}
        />
      </div>
    </div>
  );
};

const LocationInput = ({
  data,
  setData,
}: {
  data: ReportingData;
  setData: Dispatch<SetStateAction<ReportingData>>;
}) => {
  const setLocationType = (type: "station" | "train") =>
    setData((old) => ({ ...old, locationType: type }));
  return (
    <>
      <div>
        <div className="flex">
          <button
            onClick={() => setLocationType("station")}
            className={clsx(
              styles.issue,
              data.locationType == "station" && styles.selected
            )}
          >
            At a Station
          </button>
          <button
            onClick={() => setLocationType("train")}
            className={clsx(
              styles.issue,
              data.locationType === "train" && styles.selected
            )}
          >
            On a Train
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2 m-4">
        {data.locationType === "station" && (
          <>
            <SelectBox
              label="Station"
              options={TRANSIT_STATIONS.map((station) => station.name)}
              value={data.station}
              setValue={(value) =>
                setData((data) => ({ ...data, station: value }))
              }
            />
          </>
        )}
        {data.locationType === "train" && (
          <>
            <SelectBox
              label="Route"
              options={[
                "Capital Line - Clareview",
                "Capital Line - Century Park",
                "Metro Line - NAIT",
                "Metro Line - Health Sciences",
              ]}
              value={data.route}
              setValue={(value) =>
                setData((data) => ({ ...data, route: value }))
              }
            />

            <SelectBox
              label="Next Stop"
              options={
                data.route?.startsWith("Capital")
                  ? CAPITAL_LINE_STATIONS
                  : METRO_LINE_STATIONS
              }
              value={data.nextStation}
              setValue={(value) =>
                setData((data) => ({ ...data, nextStation: value }))
              }
              placeholder="Select a Station"
            />
          </>
        )}

        <label>Specific Location</label>
        <textarea
          className={styles.detailTextInput}
          rows={4}
          onChange={(e) =>
            setData((data) => ({ ...data, locationDetails: e.target.value }))
          }
          value={data.locationDetails}
          placeholder={
            data.locationType === "station"
              ? "Ex: On the platform near the elevator"
              : "Ex: Middle of the last train car, left side"
          }
        />
      </div>
    </>
  );
};

interface SelectBoxProps {
  label: string;
  options: string[];
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}
const SelectBox = ({
  options,
  value,
  setValue,
  label,
  placeholder = "Select an Option",
}: SelectBoxProps) => {
  return (
    <div className="flex flex-col w-full">
      <label>{label}</label>
      <select
        value={value}
        className="text-black p-2"
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="" disabled selected>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} className="text-black" value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const Review = ({
  data,
  setData,
}: {
  data: ReportingData;
  setData: Dispatch<SetStateAction<ReportingData>>;
}) => {
  return (
    <>
      <div className="whitespace-pre-wrap border-b-white border-b-2 p-1 mb-1">
        {formatReport(data)}
      </div>
      <label>Details</label>
      <textarea
        className={styles.detailTextInput}
        rows={4}
        value={data.details}
        onChange={(e) =>
          setData((data) => ({ ...data, details: e.target.value }))
        }
        placeholder="Incident details, identifying features (clothes, gender, hair, tattoos)"
      />
    </>
  );
};
