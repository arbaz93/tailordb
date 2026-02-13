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
  } from "../components";
  
  import { useEffect, useMemo, useState, useCallback } from "react";

  import { measurementsTemplate } from "~/utils/measurements";
  import { isPlainObject, goToTop } from "~/utils/helperFunctions";

  import {
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
  /* --------------- Show Error When Fields are Empty ---------------- */

  const [showContactNameError, setShowContactNameError] = useState<Boolean>(false);
  const [showPhoneError, setShowPhoneError] = useState<Boolean>(false);
    /* ---------------------------- State ---------------------------- */
  
    // Contact info (editable)
    const [contact, setContact] = useState({
      id:"",
      name:"",
      phone:"",
      code:'',
    });
  
    // Measurements object (deep / nested)
    const filteredTemplate = () => {

      const newObj:any = {};
    
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
                ;(newObj[key] as Record<string, unknown>)[k] =
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
    const [measurements, setMeasurements] = useState<any>(filteredTemplate());
    // Template for when we recieve no measurements from the server

    // Extra measurement schema stored locally
    const [localExtraMeasurements, setLocalExtraMeasurements] = useState<any[]>([]);

    // Track what actually changed (prevents unnecessary saves)
    const [updates, setUpdates] = useState<UpdatesState>({
      contact: false,
      measurements: false,
    });

    // UI state
    const [modalIsShowing, setModalIsShowing] = useState(false);
  
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

    const clear = () => {
      setMeasurements(filteredTemplate)
      setContact({
          id:"",
          name:"",
          phone:"",
          code:'',
      })

      goToTop();
    }
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
          console.log(prev)
  
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
      

    const updateNote = (value: string) => {
        setMeasurements((prev: any) => ({
          ...prev,
          note: value,
        }))
      }
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
                      ?.checked ?? false}
                  setter={(v) => {
                    markMeasurementsUpdated();
                      updateMeasurement("extra", m.label, v);
                  } } name={""} addStroke={undefined}            />
          );
  
        default:
          return null;
      }
    };

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

      // if name or phone are empty
      const hasEmptyRequiredFields =
        !contact?.name?.trim() || !contact?.phone?.trim();

      if (hasEmptyRequiredFields) goToTop();

      try {
        let contactId = undefined;
  
        // Save both at once
        if (updates.contact && !updates.measurements) {
          await upsertContact({
            id: undefined,
            name: contact.name,
            phone: contact.phone,
            code: contact.code,
        });
        }
  
        // Save contact only
        if (updates.contact && updates.measurements) {
          await saveContactAndMeasurements({
            id: undefined,
            name: contact.name,
            phone: contact.phone,
            code: contact.code,
            measurements: measurements
          });
        }
        clear();
        return
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

    /* ------------- Random Index that decides color --------------- */
    /* ---------------------------- JSX ---------------------------- */
    return (
      <main className="px-8 flex flex-col gap-8 pb-20">
        {/* Header */}
        <section className="flex flex-col items-center gap-4 pt-15">
          <CircleWithInitial
            text={contact.name?.trim() ? contact.name : "-"}
            css="text-[50px]"
            index={undefined}
          />
          <p className="capitalize text-heading-200 text-clr-100">
            {contact.name?.trim() ? contact.name : "-"}
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
        {showContactNameError && <p className="text-text-200 mb-[-.4rem] text-danger" >name must not be empty</p>}
        <InputBoxType100 iconCss=" h-6 w-6 fill-clr-200" required={true} text={contact.name} icon={InfoSimpleIcon} label={'Name'} setter={(value) => {
          markContactUpdated();
          setContact(prev => ({...prev, name: value})); 
          setShowContactNameError(value.trim().length === 0);
          }}/>
        {showPhoneError && <p className="text-text-200 mb-[-.4rem] text-danger" >phone must not be empty</p>}
        <InputBoxType100 iconCss=" w-6 stroke-clr-200" required={true} text={contact.phone} icon={PhoneStrokeIcon} label={'Mobile'} setter={(value) => {
          markContactUpdated();
          setContact(prev => ({...prev, phone: value}));
          setShowPhoneError(value.trim().length === 0);
          }}/>
        <InputBoxType100 iconCss="w-6 fill-clr-200 text-clr-200 rotate-[180deg]" required={true} text={contact.code} icon={ScissorThinIcon} label={'Dress Code'} setter={(value) => {
          markContactUpdated();
          setContact(prev => ({...prev, code: value}))
          }}/>
      </section>
  
      <section className="flex flex-col gap-4">
        <h3 className="text-clr-100 text-heading-200">Measurements:</h3>
        <div className="grid gap-2">
          <h4 className="text-clr-100 text-text-100">Basic:</h4>
          <div className="flex justify-between gap-x-2 gap-y-2.5">
            { basicMeasurements }
          </div>
        </div>
        
        <div className="grid gap-2">
          <h4 className="text-clr-100 text-text-100">Gender:</h4>
          <div className="grid grid-cols-2 gap-2">
            { genders }
          </div>
        </div>
  
        <div className="grid gap-2">
          <h4 className="text-clr-100 text-text-100">Upper Body:</h4>
          <div className="grid grid-cols-2 w-full gap-x-2 gap-y-2.5">
          { upperBodyMeasurements}
          </div>
        </div>
        
        <div className="grid gap-2">
          <h4 className="text-clr-100 text-text-100">Lower Body:</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
          { lowerBodyMeasurements}
          </div>
        </div>
  
        <div className="grid gap-2">
          <h4 className="text-clr-100 text-text-100">Extra:</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
  
          { extraMeasurements }
  
  
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
        <section className="grid gap-2">
          <Button100 text="Save" css="bg-primary text-white" callback={saveAll} />
          <Button100
            text="clear"
            css="bg-danger text-white"
            callback={() => clear()}
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
  