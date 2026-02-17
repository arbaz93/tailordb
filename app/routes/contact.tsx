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

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { useColorSchemeStore } from "~/zustand/colorSchemeStore";
import { useNotificationStore } from "~/zustand/notificationStore";

import { base64Decode } from "~/utils/scripting";
import { measurementsTemplate } from "~/utils/measurements";
import { goToTop, isPlainObject } from "~/utils/helperFunctions";
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

  /* ------------------------ Navigator Hook ------------------------------ */
  const navigate = useNavigate();

  /* --------------- Show Error When Fields are Empty ---------------- */

  const [showContactNameError, setShowContactNameError] = useState<Boolean>(false);
  const [showPhoneError, setShowPhoneError] = useState<Boolean>(false);
  /* ---------------------------- Params ----------------------------  */

  // Decode contact info from URL
  const { encodedData } = useParams();
  const decoded: ContactProps = JSON.parse(base64Decode(encodedData));

  /* ---------------------------- State ---------------------------- */
  
  // set color scheme
  const setColorScheme = useColorSchemeStore(state => state.setColorScheme)
  const colorScheme = useColorSchemeStore(state => state.colorScheme)

  // notifications
  const notification = useNotificationStore(state => state.notification);

  // Contact info (editable)
  const [contact, setContact] = useState({
    id: decoded.id,
    name: decoded.name,
    phone: decoded.phone,
    code: decoded.code,
  });

  // Measurements object (deep / nested)
  const [measurements, setMeasurements] = useState<any>({});
  // Template for when we recieve no measurements from the server
  const filteredTemplate = () => {

    const newObj: any = {};

    (Object.keys(measurementsTemplate) as Array<keyof typeof measurementsTemplate>)
      .forEach((key) => {

        const outerValue = measurementsTemplate[key]

        // ───────────── arrays (genders, basics)
        if (Array.isArray(outerValue)) {
          const arr = outerValue // local variable
          newObj[key] = arr.map((e: any) => ({ label: e.label, value: e.value }))
        }

        // ───────────── objects (maleMeasurements, femaleMeasurements)
        else if (isPlainObject(outerValue)) {

          const value = outerValue as Record<string, unknown>

          // ✅ initialize container
          newObj[key] = {}

          Object.keys(value).forEach((k) => {
            const innerValue = value[k]

            if (Array.isArray(innerValue)) {
              ; (newObj[key] as Record<string, unknown>)[k] =
                innerValue.map((e) => ({
                  label: e.label,
                  value: e.value,
                }))
            }
          })
        }
      })

    return newObj;
  }
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

  const unMarkContactAndMeasurementsUpdated = () =>
    setUpdates(() => ({ contact: false, measurements: false }));
  
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

  /* ------------- Handle Primary Color Round Buttons ---------------- */

  const printOneRef = useRef<HTMLElement>(null);

  const handlePrint = async () => {
    const sectionIds: string[] = ["section-1", "section-2", "section-3"]
    if (typeof window === "undefined") return;

    // Add a temporary class to show only selected sections
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("print-visible");
    });

    const prevColorScheme = colorScheme

    window.print();

    // Cleanup: remove the temporary class
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("print-visible");
    });
  };

  const handleEmail = () => {
    // Ensure this only runs in the browser (Next.js / SSR safety)
    if (typeof window === "undefined") return;

    // Cache measurement references
    const femaleBody = measurements?.femaleMeasurements;
    const maleBody = measurements?.maleMeasurements;

    // Allowed gender values
    type GenderType = "male" | "female" | undefined;

    // Measurement body sections
    type BodyPart = "upperBody" | "lowerBody";

    /**
     * Formats an array of measurements into a readable multiline string
     */
    const formatList = (
      data?: { label: string; value: string | number }[],
      indent = "              "
    ): string =>
      data
        ?.filter(item => item.value)
        .map(item => `${item.label}: ${item.value}`)
        .join(`\n${indent}`) ?? "";

    /**
     * Returns formatted upper/lower body measurements
     * - If gender is provided → returns that gender only
     * - Otherwise → returns both male & female
     */
    const getBody = (gender: GenderType, part: BodyPart): string => {
      if (gender === "male" || gender === "female") {
        const body =
          gender === "female"
            ? femaleBody?.[part]
            : maleBody?.[part];

        return `
  ${part}:
    ${formatList(body)}
  `;
      }

      return `
  male ${part}:
    ${formatList(maleBody?.[part])}
  
  female ${part}:
    ${formatList(femaleBody?.[part])}
  `;
    };

    // Generate body sections
    const upperBody = getBody(measurements?.genders, "upperBody");
    const lowerBody = getBody(measurements?.genders, "lowerBody");

    /**
     * Optional measurement sections
     */
    const basics = measurements?.basics?.length
      ? `
  basics:
    ${formatList(measurements.basics)}
  `
      : "";
    const extra = measurements?.extra?.length
      ? `
  extra:
    ${formatList(measurements.extra)}
  `
      : "";

    const note = measurements?.note
      ? `
  note:
      ${measurements.note}
  `
      : "";

    /**
     * Build & encode the email body
     */
    const body = encodeURIComponent(`
  Name: ${contact?.name}
  Phone: ${contact?.phone}
  Dress Code: ${contact?.code}
  
  Measurements:
  ${basics}
  gender: ${measurements?.genders}
  ${upperBody}
  ${lowerBody}
  ${extra}
  ${note}
  `);

    // Create and trigger mailto link
    const link = document.createElement("a");
    link.href = `mailto:?subject=Report&body=${body}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  const handleCall = () => {
    if (typeof window != undefined) {
      window.location.href = `tel:${contact.phone}`
    }
  }
  const handleMessage = () => {
    if (typeof window != undefined) {
      window.location.href = `sms:${contact.phone}`
    }
  }

  const ACTION_BUTTONS_CALLBACKS = {
    call: handleCall,
    message: handleMessage,
    print: handlePrint,
    email: handleEmail
  }
  /**
   * Update measurement value (deep + immutable)
   */
  const updateMeasurement = useCallback(
    (section: Section, label: string, value: string | boolean) => {
      setMeasurements((prev: any) => {
        // EXTRA section (checkbox + text)
        if (section === "extra") {
          const extra = [...(prev.extra ?? [])];
          const index = extra.findIndex((m) => m.label === label);

          if (index === -1) {
            extra.push(
              typeof value === "boolean"
                ? { label, value: value } // store checkbox as value too
                : { label, value }
            );
          } else {
            extra[index] = { label, value };
          }

          return { ...prev, extra };
        }

        // STANDARD sections (basics / upperBody / lowerBody)
        const path = section.split(".");
        const rootKey = path[0];
        const subKey = path[1]; // undefined for basics

        // Create new next state
        const next: any = { ...prev };

        if (!subKey) {
          // basics
          next[rootKey] = prev[rootKey].map((m: any) =>
            m.label === label ? { label, value } : { label: m.label, value: m.value }
          );
        } else {
          // maleMeasurements / femaleMeasurements
          next[rootKey] = {
            ...prev[rootKey],
            [subKey]: prev[rootKey][subKey].map((m: any) =>
              m.label === label ? { label, value } : { label: m.label, value: m.value }
            ),
          };
        }

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
    const iconCss = `${m?.css ?? ""} h-5 w-5 m-icon`;

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
            addStroke={m.addStroke}
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
            checked={measurements?.extra?.find((e: any) => e.label === m.label)
              ?.value ?? false}
            setter={(v) => {
              markMeasurementsUpdated();
              updateMeasurement("extra", m.label, v);
            }} name={""} addStroke={undefined} />
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

  // Merge Both templateMEasurements and server recieved measurements
  function deepMerge(template: any, serverData: any): any {
    if (Array.isArray(template)) {
      // If template is array of objects with label
      return template.map(item => {
        if (item.label) {
          // find corresponding server item
          const serverItem = Array.isArray(serverData)
            ? serverData.find((s: any) => s.label === item.label)
            : undefined;
          return {
            ...item,
            value: serverItem?.value ?? item.value,
          };
        }
        // Otherwise, recursively merge
        return deepMerge(item, serverData);
      });
    } else if (Array.isArray(serverData)) {
      // template is not array, serverData is array → just use serverData
      return serverData;
    } else if (typeof template === "object" && template !== null) {
      const result: any = { ...template };
  
      // Merge template keys
      for (const key in template) {
        result[key] = deepMerge(template[key], serverData?.[key]);
      }
  
      // Add extra keys from serverData
      if (serverData && typeof serverData === "object") {
        for (const key in serverData) {
          if (!(key in template)) {
            result[key] = serverData[key];
          }
        }
      }
  
      return result;
    } else {
      // primitive → take serverData if exists, else template
      return serverData !== undefined ? serverData : template;
    }
  }
  
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

      if ("data" in res) {
        // success
        const mergedMeasurements = deepMerge(filteredTemplate(), res.data?.measurements);
        setMeasurements(
          res.status === 404
            ? { ...filteredTemplate() }
            : mergedMeasurements
        );

        setMeasurementsStatus({
          status: res.status,
          message: "Loaded successfully",
        });
      } else {
        // error
        setMeasurements({ ...filteredTemplate() });

        setMeasurementsStatus({
          status: res.status,
          message: res.message,
        });
      }

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
    if(notification.type === "processing") return;

    let contactId = contact.id;

    // if name or phone are empty
    const hasEmptyRequiredFields =
      !contact?.name?.trim() || !contact?.phone?.trim();

    if (hasEmptyRequiredFields) goToTop();

    // Save both at once
    if (updates.contact && updates.measurements) {
      const res = await saveContactAndMeasurements({
        ...contact,
        measurements,
      });

      if (!("data" in res)) {
        console.error("Save failed:", res.message);
        return;
      }
      unMarkContactAndMeasurementsUpdated()
      return;
    }

    // Save contact only
    if (updates.contact) {
      const res = await upsertContact(contact);

      if (!("data" in res)) {
        console.error("Save failed:", res.message);
        return;
      }
      unMarkContactAndMeasurementsUpdated()
      contactId = res.data?._id ?? contactId;
    }

    // Save measurements only
    if (updates.measurements && contactId) {
      const res = await saveMeasurements({
        id: contactId,
        measurements,
      });

      if (!("data" in res)) {
        console.error("Save failed:", res.message);
        return;
      }
      unMarkContactAndMeasurementsUpdated()
    }
  };

  /* ---------------------------- Delete Logic ---------------------------- */
  const handleDelete = async () => {
    if(notification.type === "processing") return

    const res = await deleteContactWithMeasurements(contact.id)
    if (res.status === 200) {
      navigate("/")
    }
  }

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
      <section ref={printOneRef} id="section-1" className="flex flex-col items-center gap-4 pt-15  print-visible">
        <CircleWithInitial
          text={contact.name?.trim() ? contact.name : "-"}
          css="text-[50px] circle-with-inital"
          index={decoded.index}
        />
        <p className="capitalize text-heading-200 text-clr-100 print-heading">
          {contact.name?.trim() ? contact.name : "-"}
        </p>
      </section>

      {/* Actions */}
      <section className="flex justify-between no-print">
        {ACTION_BUTTONS.map((btn, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <IconButton icon={btn.Icon} callback={() => { ACTION_BUTTONS_CALLBACKS[btn.name]() }} />
            <p className="capitalize text-text-200 text-clr-200">
              {btn.name}
            </p>
          </div>
        ))}
      </section>

      {/* Contact */}
      <section className="flex flex-col gap-2 stroke-clr-200  print-visible" id="section-2">
      <h3 className="text-clr-100 text-heading-200">Contact:</h3>
        {showContactNameError && <p className="text-text-200 mb-[-.4rem] text-danger" >name must not be empty</p>}
        <InputBoxType100 required={true} iconCss=" h-6 w-6 fill-clr-200 m-icon" text={contact.name} icon={InfoSimpleIcon} label={'Name'} setter={(value) => {
          setContact(prev => ({ ...prev, name: value }));
          markContactUpdated();
          setShowContactNameError(value.trim().length === 0);
        }} />
        {showPhoneError && <p className="text-text-200 mb-[-.4rem] text-danger">phone must not be empty</p>}
        <InputBoxType100 required={true} iconCss=" w-6 stroke-clr-200 m-icon" text={contact.phone} icon={PhoneStrokeIcon} label={'Mobile'} setter={(value) => {
          setContact(prev => ({ ...prev, phone: value }));
          markContactUpdated();
          setShowPhoneError(value.trim().length === 0);
        }} />
        <InputBoxType100 required={true} iconCss="w-6 fill-clr-200 text-clr-200 rotate-[180deg] m-icon " text={contact.code} icon={ScissorThinIcon} label={'Dress Code'} setter={(value) => {
          setContact(prev => ({ ...prev, code: value }))
          markContactUpdated();
        }} />
      </section>

      {/* Measurements */}
      <section className="flex flex-col gap-4  print-visible"  id="section-3">
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


            <button className='bg-bg-200 text-clr-100 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]' onClick={() => setModalIsShowing(true)}>
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
      <section className="grid gap-2">
        <Button100 text="Save" css="bg-primary text-white" callback={saveAll} />
        <Button100
          text="Delete"
          css="bg-danger text-white"
          callback={handleDelete}
        />

      </section>

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
