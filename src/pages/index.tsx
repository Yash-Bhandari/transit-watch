import clsx from "clsx";
import xor from "lodash/xor";
import { Dispatch, SetStateAction, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { Button } from "../components/Button";
import {
  CAPITAL_LINE_STATIONS,
  METRO_LINE_STATIONS,
  TRANSIT_STATIONS,
} from "../data";
import styles from "../styles/index.module.css";
import { ReportingData } from "../types";

const stages = [
  "issue",
  "locationType",
  "locationDetails",
  "details",
  "submit",
];

type Stages = (typeof stages)[number];

export default function Home() {
  const [data, setData] = useState<ReportingData>({
    locationType: "station",
    station: "Corona",
    issues: [],
    route: "Capital - Clareview",
  });

  const [stage, setStage] = useState<number>(0);

  const locationTypeSetter = (type: "station" | "train") => () =>
    setData((old) => ({ ...old, locationType: type }));

  const onSubmit = () => {
    fetch("/api/submitReport", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  let canProceed = true;
  if (stage === 0 && data.issues.length === 0) canProceed = false;
  if (stage === 1 && data.locationDetails === undefined) canProceed = false;

  return (
    <main className="w-full flex flex-col items-center text-center text-white">
      <h1 className={styles.header}>ETS Transit Watch</h1>
      <div className={styles.content}>
        <div className="grid place-items-center mx-2">
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
              />
              <p className="mt-8">You may select multiple options.</p>
              <p>
                Reports are forwarded immediately to the Transit Watch hotline{" "}
              </p>
            </>
          )}
          {stages[stage] === "locationType" && (
            <>
              <h2>Location</h2>
              <LocationInput data={data} setData={setData} />
            </>
          )}

          <div className="flex absolute bottom-3">
            {stage !== 0 && (
              <Button
                onClick={() => setStage(stage - 1)}
                text="Back"
                variant="outline"
                color="primary"
                disabled={data.issues.length === 0}
              />
            )}
            <Button
              onClick={() => setStage(stage + 1)}
              text="Continue"
              color="primary"
              disabled={!canProceed}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const issueChoices = [
  "Drug Use",
  "Violence",
  "Threatening Behaviour",
  "Obstruction",
  "Harassment",
];

interface IssueSelectorProps {
  selectedIssues: string[];
  toggleSelect: (issue: string) => void;
}
const IssueSelector = ({
  selectedIssues,
  toggleSelect,
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
        Other: <input type="text" />
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
        {/* <input
          id="station"
          type="radio"
          value="station"
          checked={data.locationType === "station"}
          onChange={() => setLocationType("station")}
          className="mr-2"
        />
        <label className="mr-3" htmlFor="station">
          At a station
        </label>

        <label htmlFor="train">
          <input
            id="train"
            type="radio"
            value="train"
            checked={data.locationType === "train"}
            onChange={() => setLocationType("train")}
          />
          On a train
        </label> */}
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
                "Capital - Clareview",
                "Capital - Century Park",
                "Metro - NAIT",
                "Metro - Health Sciences",
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
            />
          </>
        )}

        <label className="pt-2">Specific Location</label>
        <textarea
          className={styles.detailTextInput}
          rows={4}
          onChange={(e) =>
            setData((data) => ({ ...data, locationDetails: e.target.value }))
          }
          placeholder={
            data.locationType === "station"
              ? "Ex: On the platform near the west escalators"
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
}
const SelectBox = ({ options, value, setValue, label }: SelectBoxProps) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>

      <select
        value={value}
        className="text-black p-2"
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="" disabled selected>Select</option>
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
      <textarea
        className={styles.detailTextInput}
        rows={4}
        onChange={(e) =>
          setData((data) => ({ ...data, locationDetails: e.target.value }))
        }
        placeholder="Clothes, hair, tattoos, etc."
      />
    </>
  );
};

const Stages = () => {};

const formatData = (data: ReportingData): string => {
  let out = "";
  if (data.locationType === "station")
    out += `Location: ${data.locationDetails}\n`;
  if (data.locationDetails) out += `${data.locationDetails}`;
  return out;
};
