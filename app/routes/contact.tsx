import {
  CircleWithInitial,
  IconButton,
  InputBoxType100,
  InputCheckBox,
  InputText,
  InputRadio,
  AddExtraBox,
  InputNote,
  Button100,
  PhantomBox,
} from "../components";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router";

import { base64Decode } from "~/utils/scripting";
import { measurementsTemplate } from "~/utils/measurements";

import {
  deleteContactWithMeasurements,
  saveMeasurements,
  getMeasurements,
  saveContactAndMeasurements,
  upsertContact,
} from "~/scripts/contactAndMeasurementFetchFunctions";

import {
  PhoneFilledIcon,
  CloudIcon,
  EnvelopeIcon,
  PrinterIcon,
  PhoneStrokeIcon,
  ScissorThinIcon,
  InfoSimpleIcon,
} from "~/icons/miscIcons";

import { InfoIcon } from "~/icons/measurementsIcons";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type ContactProps = {
  id: string;
  name: string;
  phone: string;
  code: string;
  index: number;
};

type Section =
  | "basics"
  | "genders"
  | "maleMeasurements.upperBody"
  | "maleMeasurements.lowerBody"
  | "femaleMeasurements.upperBody"
  | "femaleMeasurements.lowerBody"
  | "extra";

type UpdatesState = {
  contact: boolean;
  measurements: boolean;
};

type MeasurementsStatus = {
  status: number;
  message: string;
};

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

// Header action buttons (icons only, callbacks later)
const ACTION_BUTTONS = [
  { name: "call", Icon: PhoneFilledIcon },
  { name: "message", Icon: CloudIcon },
  { name: "print", Icon: PrinterIcon },
  { name: "email", Icon: EnvelopeIcon },
] as const;

// Measurement statuses that mean "render UI"
const READY_STATUSES = new Set([200, 404]);

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Contact() {
  /* ---------------------------- Params ---------------------------- */

  // Decode contact info from URL
  const { encodedData } = useParams();
  const decoded: ContactProps = JSON.parse(base64Decode(encodedData));

  /* ---------------------------- State ---------------------------- */

  // Contact info (editable)
  const [contact, setContact] = useState({
    id: decoded.id,
    name: decoded.name,
    phone: decoded.phone,
    code: decoded.code,
  });

  // Measurements object (deep / nested)
  const [measurements, setMeasurements] = useState<any>({});

  // Extra measurement schema stored locally
  const [localExtraMeasurements, setLocalExtraMeasurements] = useState<any[]>([]);

  // UI state
  const [modalIsShowing, setModalIsShowing] = useState(false);

  // Track what actually changed (prevents unnecessary saves)
  const [updates, setUpdates] = useState<UpdatesState>({
    contact: false,
    measurements: false,
  });

  // API fetch status
  const [measurementsStatus, setMeasurementsStatus] =
    useState<MeasurementsStatus>({ status: 100, message: "" });

  const isReady = READY_STATUSES.has(measurementsStatus.status);

  /* ---------------------------- Helpers ---------------------------- */

  // Markers to avoid repeating setState logic everywhere
  const markContactUpdated = () =>
    setUpdates((p) => ({ ...p, contact: true }));

  const markMeasurementsUpdated = () =>
    setUpdates((p) => ({ ...p, measurements: true }));

  /**
   * Safely read a value from a nested measurement section
   */
  const getSectionValue = useCallback(
    (section: Section, label: string): string => {
      if (section === "genders") return measurements?.genders ?? "";

      const path = section.split(".");
      let target = measurements;

      for (const key of path) target = target?.[key];

      return target?.find((m: any) => m.label === label)?.value ?? "";
    },
    [measurements]
  );

  /**
   * Update measurement value (deep + immutable)
   */
  const updateMeasurement = useCallback(
    (section: Section, label: string, value: string | boolean) => {
      setMeasurements((prev: any) => {
        const next = structuredClone(prev);

        // EXTRA measurements (checkbox + text)
        if (section === "extra") {
          next.extra ??= [];

          let item = next.extra.find((m: any) => m.label === label);
          if (!item) {
            item = { label };
            next.extra.push(item);
          }

          typeof value === "boolean"
            ? (item.checked = value)
            : (item.value = value);

          return next;
        }

        // Standard nested sections
        const path = section.split(".");
        let target = next;

        for (const key of path) target = target[key];

        const item = target.find((m: any) => m.label === label);
        if (item) item.value = value;

        return next;
      });
    },
    []
  );

  /* ---------------------------- Input Renderer ---------------------------- */

  /**
   * Centralized renderer for all measurement inputs
   */
  const renderInput = (m: any, section: Section, index: number) => {
    const isExtra = section === "extra";
    const iconCss = `${m?.css ?? ""} h-5 w-5`;

    switch (m.type) {
      case "text":
        return (
          <InputText
            key={`${section}-${index}`}
            index={index}
            label={m.label}
            value={getSectionValue(section, m.label)}
            icon={m.icon ?? InfoIcon}
            iconCss={iconCss}
            addStroke={m.addStroke}
            setter={(v) => {
              markMeasurementsUpdated();
              updateMeasurement(section, m.label, v);
            }}
          />
        );

      case "radio":
        return (
          <InputRadio
            key={`${section}-${m.label}-${index}`}
            name={isExtra ? m.group ?? "extra" : section}
            index={index}
            value={m.label}
            label={m.label}
            icon={m.icon ?? InfoIcon}
            iconCss={iconCss}
            checked={
              isExtra
                ? measurements?.extra?.find(
                    (e: any) => e.label === m.group
                  )?.value === m.label
                : measurements?.genders === m.label
            }
            setter={(v) => {
              markMeasurementsUpdated();
              isExtra
                ? updateMeasurement("extra", m.group, v)
                : setMeasurements((p: any) => ({ ...p, genders: v }));
            }}
          />
        );

      case "checkbox":
        return (
          <InputCheckBox
            key={`extra-${m.label}-${index}`}
            index={index}
            label={m.label}
            icon={InfoIcon}
            iconCss="h-6 w-6"
            checked={
              measurements?.extra?.find((e: any) => e.label === m.label)
                ?.checked ?? false
            }
            setter={(v) => {
              markMeasurementsUpdated();
              updateMeasurement("extra", m.label, v);
            }}
          />
        );

      default:
        return null;
    }
  };

  const updateNote = (value: string) => {
    setMeasurements((prev: any) => ({
      ...prev,
      note: value,
    }))
  }
  /* ---------------------------- Effects ---------------------------- */

  /**
   * Load local extras + fetch measurements
   */
  useEffect(() => {
    // Local storage (safe parse)
    try {
      const raw = localStorage.getItem("tailor-db-extra");
      setLocalExtraMeasurements(raw ? JSON.parse(raw) : []);
    } catch {
      setLocalExtraMeasurements([]);
    }

    if (!contact.id) {
      setMeasurementsStatus({ status: 400, message: "Missing contact id" });
      return;
    }

    getMeasurements(contact.id).then((res) => {
      setMeasurements(
        res.status === 404 ? measurementsTemplate : res.data?.measurements
      );

      setMeasurementsStatus({
        status: res.status,
        message: res.message,
      });
    });
  }, [contact.id]);

  /* ---------------------------- Memo ---------------------------- */

  /**
   * Merge local extra schema with saved values
   */
  const mergedExtraMeasurements = useMemo(() => {
    const map = new Map<string, any>();

    localExtraMeasurements.forEach((i) => map.set(i.label, { ...i }));
    measurements?.extra?.forEach((i: any) =>
      map.set(i.label, { ...map.get(i.label), ...i })
    );

    return Array.from(map.values());
  }, [localExtraMeasurements, measurements]);

  /* ---------------------------- Save Logic ---------------------------- */

  const saveAll = async () => {
    try {
      let contactId = contact.id;

      // Save both at once
      if (updates.contact && updates.measurements) {
        await saveContactAndMeasurements({ ...contact, measurements });
        return;
      }

      // Save contact only
      if (updates.contact) {
        const res = await upsertContact(contact);
        contactId = res.data._id ?? contactId;
      }

      // Save measurements only
      if (updates.measurements && contactId) {
        await saveMeasurements({ id: contactId, measurements });
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  /* ---------------------------- Derived UI ---------------------------- */

  const basicMeasurements = measurementsTemplate.basics.map((m, i) =>
    renderInput(m, "basics", i)
  );

  const genders = measurementsTemplate.genders.map((m, i) =>
    renderInput(m, "genders", i)
  );

  const upperBodyMeasurements =
    measurements.genders === "male"
      ? measurementsTemplate.maleMeasurements.upperBody.map((m, i) =>
          renderInput(m, "maleMeasurements.upperBody", i)
        )
      : measurementsTemplate.femaleMeasurements.upperBody.map((m, i) =>
          renderInput(m, "femaleMeasurements.upperBody", i)
        );

  const lowerBodyMeasurements =
    measurements.genders === "male"
      ? measurementsTemplate.maleMeasurements.lowerBody.map((m, i) =>
          renderInput(m, "maleMeasurements.lowerBody", i)
        )
      : measurementsTemplate.femaleMeasurements.lowerBody.map((m, i) =>
          renderInput(m, "femaleMeasurements.lowerBody", i)
        );

  const extraMeasurements = mergedExtraMeasurements.map((m, i) =>
    renderInput(m, "extra", i)
  );

  /* ---------------------------- JSX ---------------------------- */

  return (
    <main className="px-8 flex flex-col gap-8 pb-20">
      {/* Header */}
      <section className="flex flex-col items-center gap-4 pt-15">
        <CircleWithInitial
          text={contact.name}
          css="text-[50px]"
          index={decoded.index}
        />
        <p className="capitalize text-heading-200 text-clr-100">
          {contact.name}
        </p>
      </section>

      {/* Actions */}
      <section className="flex justify-between">
        {ACTION_BUTTONS.map((btn, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <IconButton icon={btn.Icon} callback={() => {}} />
            <p className="capitalize text-text-200 text-clr-200">
              {btn.name}
            </p>
          </div>
        ))}
      </section>


      <section className="flex flex-col gap-2 stroke-clr-200">
      <InputBoxType100 iconCss=" h-6 w-6 fill-clr-200" text={contact.name} icon={InfoSimpleIcon} label={'Name'} setter={(value) => {
        setContact(prev => ({...prev, name: value})); 
        setUpdates(prev => ({...prev, contact: true}))
        }}/>
      <InputBoxType100 iconCss=" w-6 stroke-clr-200" text={contact.phone} icon={PhoneStrokeIcon} label={'Mobile'} setter={(value) => {
        setContact(prev => ({...prev, phone: value}));
        setUpdates(prev => ({...prev, contact: true}))
        }}/>
      <InputBoxType100 iconCss="w-6 fill-clr-200 text-clr-200 rotate-[180deg]" text={contact.code} icon={ScissorThinIcon} label={'Dress Code'} setter={(value) => {
        setContact(prev => ({...prev, code: value}))
        setUpdates(prev => ({...prev, contact: true}))
        }}/>
    </section>

    <section className="flex flex-col gap-4">
      <h3 className="text-clr-100 text-heading-200">Measurements:</h3>
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Basic:</h4>
        <div className="flex justify-between gap-x-2 gap-y-2.5">
          {measurementsStatus?.status == 200 || measurementsStatus?.status == 404 ? basicMeasurements : <PhantomBox numberOfPhantomBoxes={measurementsTemplate.basics.length} css={'h-15 w-full'} />}
        </div>
      </div>
      
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Gender:</h4>
        <div className="grid grid-cols-2 gap-2">
          {measurementsStatus?.status == 200 || measurementsStatus?.status == 404 ? genders : <PhantomBox numberOfPhantomBoxes={measurementsTemplate.genders.length} css={'h-15 w-full'} />}
        </div>
      </div>

      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Upper Body:</h4>
        <div className="grid grid-cols-2 w-full gap-x-2 gap-y-2.5">
        {measurementsStatus?.status == 200 || measurementsStatus?.status == 404 ? upperBodyMeasurements : <PhantomBox numberOfPhantomBoxes={measurementsTemplate.maleMeasurements.upperBody.length} css={'h-15 w-full'} />}
        </div>
      </div>
      
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Lower Body:</h4>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
        {measurementsStatus?.status == 200 || measurementsStatus?.status == 404 ? lowerBodyMeasurements : <PhantomBox numberOfPhantomBoxes={measurementsTemplate.maleMeasurements.lowerBody.length} css={'h-15 w-full'} />}
        </div>
      </div>

      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Extra:</h4>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">

        {measurementsStatus?.status == 200 || measurementsStatus?.status == 404 ? extraMeasurements : <PhantomBox numberOfPhantomBoxes={localExtraMeasurements?.length} css={'h-15 w-full'} />}


        <button className='bg-bg-200 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]' onClick={() => setModalIsShowing(true)}>
            <div className='flex gap-2 items-center justify-between w-full'>
                <div className='flex-1'>
                    +
                    <p className='text-text-300 text-clr-200 font-light w-full text-center'>{'ADD'}</p>
                </div>
            </div>
        </button>
        </div>
      </div>
      <InputNote
         value={measurements?.note ?? ''}
         setter={updateNote}
      />
    </section>



      {/* Save / Delete */}
      <Button100 text="Save" css="bg-primary text-white" callback={saveAll} />
      <Button100
        text="Delete"
        css="bg-danger text-white"
        callback={() => deleteContactWithMeasurements(contact.id)}
      />

      <AddExtraBox
        modalIsShowing={modalIsShowing}
        setModalIsShowing={setModalIsShowing}
        addLocalExtra={(e) =>
          setLocalExtraMeasurements((p) => [...p, e])
        }
      />
    </main>
  );
}
