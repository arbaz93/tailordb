import { CircleWithInitial, IconButton, InputBoxType100, InputCheckBox, InputText, InputRadio, AddExtraBox, InputNote, Button100, PhantomBox } from "../components";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { base64Decode } from "~/utils/scripting";
import { PhoneFilledIcon, CloudIcon, EnvelopeIcon, PrinterIcon, PhoneStrokeIcon, ScissorThinIcon } from "~/icons/miscIcons";
import { measurementsTemplate } from "~/utils/measurements";
import { saveMeasurements, getMeasurements } from "~/scripts/fetchMeasurements";
import { deleteContactWithMeasurements } from "~/scripts/contactFetchFunctions"
import { InfoIcon } from "~/icons/measurementsIcons";
import { hasSvgChild } from "~/utils/helperFunctions";

type ContactProps = {
  id: string,
  name: string,
  phone: string,
  code: string,
  index: number
}
type InputType = 
| 'text'
| 'radio'
| 'checkbox'

const buttons = [
  {
    name: 'call',
    Icon: PhoneFilledIcon,
    callback: () => {}
  },
  {
    name: 'message',
    Icon: CloudIcon,
    callback: () => {}
  },
  {
    name: 'print',
    Icon: PrinterIcon,
    callback: () => {}
  },
  {
    name: 'email',
    Icon: EnvelopeIcon,
    callback: () => {}
  },
]


export default function Contact() {

  const { encodedData } = useParams();
  const { id, name, phone, code, index }: ContactProps = JSON.parse(base64Decode(encodedData));
  const [contact, setContact] = useState({id, name, phone, code});
  const [measurementsStatus, setMeasurementsStatus] = useState({ status: 100, message: ''});
  const [measurements, setMeasurements] = useState<any>({});
  const [modalIsShowing, setModalIsShowing] = useState<boolean>(false);
  const [localExtraMeasurements, setLocalExtraMeasurements] = useState<any>([])
  const getSectionValue = (
    section: Section,
    label: string
  ): string => {
    if (section === 'genders') {
      return measurements?.genders ?? ''
    }
  
    const path = section.split('.')
    let target: any = measurements
  
    for (const key of path) {
      target = target?.[key]
    }
  
    return target?.find((m: any) => m.label === label)?.value ?? '' 
  }
  
  const renderInput = (
    m: any,
    section: Section,
    i: number
  ) => {
    const isExtra = section === 'extra'
    const iconCss = hasSvgChild(<m.icon />, 'path') ? m?.css + ' text-rose-400 ' : m?.css + ' h-5 w-5 '; 
    switch (m.type) {
      case 'text':
        return (
          <InputText
            key={`${section}-${i}`}
            index={i}
            value={getSectionValue(section, m.label)}
            label={m.label}
            icon={m?.icon ?? InfoIcon}
            iconCss={m.css ? iconCss + ' stroke-clr-200' : 'h-5 w-5'}
            setter={(v: string) =>
              updateMeasurement(section, m.label, v)
            }
          />
        )
  
      case 'radio':
        return (
          <InputRadio
          key={`${section}-${m.label}-${i}`}
          name={isExtra ? m.group ?? 'extra' : section}
          index={i}
          value={m.label}
          label={m.label}
          icon={m?.icon ?? InfoIcon}
          iconCss={m.css ?? 'h-5 w-5'}
          checked={
            isExtra
              ? measurements?.extra?.find((e: any) => e.label === m.group)
                  ?.value === m.label
              : measurements?.genders === m.label
          }
          setter={(v: string) => {
            if (isExtra) {
              updateMeasurement('extra', m.group, v)
            } else {
              setMeasurements((prev: any) => ({
                ...prev,
                genders: v,
              }))
            }
          }}
        />
        )
  
      case 'checkbox':
        return (
          <InputCheckBox
        key={`extra-${m.label}-${i}`}
        name="extra"
        index={i}
        label={m.label}
        value={m.label}
        icon={InfoIcon}
        iconCss="h-6 w-6"
        checked={
          measurements?.extra?.find((e: any) => e.label === m.label)
            ?.checked ?? false
        }
        setter={(v: boolean) =>
          updateMeasurement('extra', m.label, v)
        }
      />
        )
  
      default:
        return null
    }
  }
  
  const updateMeasurements = async () => {
    try {
      const req = await saveMeasurements({id,measurements});
      console.log(req)
    } catch(err) {
      console.error(err)

    }
  }
  const deleteContactandMeasurement = async () => {
    try {
      const req = await deleteContactWithMeasurements(id);
      console.log(req)
    } catch(err) {
      console.error(err)
    }
  }

  type Section =
  | 'basics'
  | 'genders'
  | 'maleMeasurements.upperBody'
  | 'maleMeasurements.lowerBody'
  | 'femaleMeasurements.upperBody'
  | 'femaleMeasurements.lowerBody'
  | 'extra'

  const updateMeasurement = (
    section: Section,
    label: string,
    value: string | boolean
  ) => {
    setMeasurements((prev: any) => {
      const next = structuredClone(prev)
  
      // ✅ EXTRA (text + checkbox)
      if (section === 'extra') {
        if (!Array.isArray(next.extra)) {
          next.extra = []
        }
  
        let item = next.extra.find((m: any) => m.label === label)
  
        if (!item) {
          item = { label }
          next.extra.push(item)
        }
  
        if (typeof value === 'boolean') {
          item.checked = value
        } else {
          item.value = value
        }
  
        return next
      }
  
      // ✅ DEFAULT (existing logic)
      const path = section.split('.') as string[]
      let target: any = next
  
      for (const key of path) {
        target = target[key]
      }
  
      const item = target.find((m: any) => m.label === label)
      if (item) item.value = value
  
      return next
    })
  }

  const addLocalExtra = (newExtra: any) => {
    setLocalExtraMeasurements((prev: any[]) => [...prev, newExtra]);
  };
  
  const mergedExtraMeasurements = useMemo(() => {
    const map = new Map<string, any>();
  
    // Start with local schema
    localExtraMeasurements?.forEach((item: any) => {
      map.set(item.label, { ...item });
    });
  
    // Merge saved values
    measurements?.extra?.forEach((item: any) => {
      if (map.has(item.label)) {
        map.set(item.label, {
          ...map.get(item.label),
          ...item, // inject value / checked / value
        });
      } else {
        map.set(item.label, item);
      }
    });
  
    return Array.from(map.values());
  }, [localExtraMeasurements, measurements]);
  



  const updateNote = (value: string) => {
    setMeasurements((prev: any) => ({
      ...prev,
      note: value,
    }))
  }
  useEffect(() => {
    const template = {
      "genders": "male",
      "basics": [
          {
              "label": "height",
              "value": ""
          },
          {
              "label": "weight",
              "value": ""
          }
      ],
      "maleMeasurements": {
          "upperBody": [
              {
                  "label": "neck",
                  "value": ""
              },
              {
                  "label": "shoulders",
                  "value": ""
              },
              {
                  "label": "chest",
                  "value": ""
              },
              {
                  "label": "upperchest",
                  "value": ""
              },
              {
                  "label": "underbust",
                  "value": ""
              },
              {
                  "label": "arms",
                  "value": ""
              },
              {
                  "label": "biceps",
                  "value": ""
              },
              {
                  "label": "Wrists",
                  "value": ""
              },
              {
                  "label": "back",
                  "value": ""
              },
              {
                  "label": "front",
                  "value": ""
              },
              {
                  "label": "shoulder waist",
                  "value": ""
              }
          ],
          "lowerBody": [
              {
                  "label": "waist",
                  "value": ""
              },
              {
                  "label": "high hip",
                  "value": ""
              },
              {
                  "label": "hip",
                  "value": ""
              },
              {
                  "label": "thigh",
                  "value": ""
              },
              {
                  "label": "knee",
                  "value": ""
              },
              {
                  "label": "calf",
                  "value": ""
              },
              {
                  "label": "outseam",
                  "value": ""
              },
              {
                  "label": "inseam",
                  "value": ""
              },
              {
                  "label": "pajama",
                  "value": ""
              }
          ]
      },
      "femaleMeasurements": {
          "upperBody": [
              {
                  "label": "neck",
                  "value": ""
              },
              {
                  "label": "shoulders",
                  "value": ""
              },
              {
                  "label": "chest",
                  "value": ""
              },
              {
                  "label": "upperchest",
                  "value": ""
              },
              {
                  "label": "underbust",
                  "value": ""
              },
              {
                  "label": "arms",
                  "value": ""
              },
              {
                  "label": "biceps",
                  "value": ""
              },
              {
                  "label": "Wrists",
                  "value": ""
              },
              {
                  "label": "back",
                  "value": ""
              },
              {
                  "label": "front",
                  "value": ""
              },
              {
                  "label": "shoulder waist",
                  "value": ""
              }
          ],
          "lowerBody": [
              {
                  "label": "waist",
                  "value": ""
              },
              {
                  "label": "high hip",
                  "value": ""
              },
              {
                  "label": "hip",
                  "value": ""
              },
              {
                  "label": "waist to hip",
                  "value": ""
              },
              {
                  "label": "thigh",
                  "value": ""
              },
              {
                  "label": "knee",
                  "value": ""
              },
              {
                  "label": "calf",
                  "value": ""
              },
              {
                  "label": "outseam",
                  "value": ""
              },
              {
                  "label": "inseam",
                  "value": ""
              },
              {
                  "label": "pajama",
                  "value": ""
              }
          ]
      }
  }
    // 1. Local storage: always guard JSON.parse
    try {
      const raw = window.localStorage.getItem("tailor-db-extra");
      setLocalExtraMeasurements(raw ? JSON.parse(raw) : []);
    } catch {
      console.warn("Invalid localStorage data for tailor-db-extra");
      setLocalExtraMeasurements([]);
    }
  
    // 2. Fetch measurements (never throws)
    if (!contact?.id) {
      setMeasurementsStatus({
        status: 400,
        message: "Missing contact id",
      });
      return;
    }
  
    getMeasurements(contact.id).then(res => {
      if (res.status === 200) {
        setMeasurements(res.data?.measurements);
      }
      console.log(res.status)
      if (res.status === 404) {
        setMeasurements(template);
      }
  
      setMeasurementsStatus({
        status: res.status,
        message: res.message,
      });
    });
  
  }, [contact?.id]);
  

  function getExtra() {
    console.log(measurements)
  }
  const basicMeasurements = measurementsTemplate.basics.map((m:any, i:number) => renderInput(m, 'basics', i));
    const upperBodyMeasurements = (measurements.genders === 'male' ? measurementsTemplate.maleMeasurements.upperBody
    : measurementsTemplate.femaleMeasurements.upperBody).map((m: any, i: number) => renderInput(m, measurements.genders === 'male' ? 'maleMeasurements.upperBody' : 'femaleMeasurements.upperBody', i)
    );
  const lowerBodyMeasurements = (measurements.genders === 'male' ? measurementsTemplate.maleMeasurements.lowerBody
          : measurementsTemplate.femaleMeasurements.lowerBody).map((m: any, i: number) => renderInput(m, measurements.genders === 'male' ? 'maleMeasurements.lowerBody' : 'femaleMeasurements.lowerBody', i)
      );
  const genders = measurementsTemplate.genders.map((m:any, i:number) => renderInput(m, 'genders', i));
  const extraMeasurements = mergedExtraMeasurements.map((m: any, i: number) =>
          renderInput(m, 'extra', i)
        );
  return <main className="px-8 flex flex-col gap-8 pb-20" onClick={getExtra}>
    <section className="flex flex-col items-center gap-4 pt-15">
      <CircleWithInitial text={contact.name} css=' text-[50px]' index={index} />
      <p className="capitalize text-center text-heading-200 text-clr-100 font-normal">{contact.name}</p>
    </section>
    <section className="flex justify-between ">
      {buttons.map((btn,i) => <div key={i} className="flex flex-col gap-1 items-center">
        <IconButton icon={btn.Icon} css="" callback={btn.callback}/>
        <p className="capitalize text-text-200 text-clr-200">{btn.name}</p>
      </div>)}
    </section>
    <section className="flex flex-col gap-2 stroke-clr-200">
      <InputBoxType100 iconCss=" w-6 stroke-clr-200" text={contact.phone} icon={PhoneStrokeIcon} label={'Mobile'} setter={(value) => {setContact(prev => ({...prev, phone: value}))}}/>
      <InputBoxType100 iconCss="w-6 fill-clr-200 rotate-[180deg]" text={contact.code} icon={ScissorThinIcon} label={'Dress Code'} setter={(value) => {setContact(prev => ({...prev, code: value}))}}/>
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
      <Button100 text='Save' css='text-clr-100 bg-primary' callback={() => updateMeasurements()}/> 
      <Button100 text='Delete' css='text-clr-100 bg-danger' callback={() => deleteContactandMeasurement()}/> 
    </section>
    <AddExtraBox modalIsShowing={modalIsShowing} setModalIsShowing={setModalIsShowing} addLocalExtra={addLocalExtra}/>


  </main>
}
